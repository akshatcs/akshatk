/**
 * Markdown → HTML.
 *
 * Runs only at build time (it lives in `$lib/server`), so none of these
 * libraries are shipped to the browser. Math is rendered to plain HTML by
 * KaTeX here, so readers don't download any JavaScript for equations either.
 *
 * The pipeline is a chain of small, single-purpose plugins:
 *   markdown text → [remark: markdown syntax tree] → [rehype: HTML syntax tree] → HTML string
 */
import { unified, type Plugin } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import type { Root, Element } from 'hast';
import type { TocItem } from '$lib/types';

export interface RenderedMarkdown {
	html: string;
	toc: TocItem[];
}

export interface RenderOptions {
	/** The site's base path (e.g. "/my-repo" on GitHub Pages project sites, otherwise ""). */
	base: string;
	/** Returns the final URL of a file referenced relative to the markdown file, or undefined if it doesn't exist. */
	resolveAsset: (relativePath: string) => string | undefined;
}

/** Converts a markdown string into HTML. */
export async function renderMarkdown(
	markdown: string,
	{ base, resolveAsset }: RenderOptions
): Promise<RenderedMarkdown> {
	const file = await unified()
		.use(remarkParse) //                        parse markdown
		.use(remarkGfm) //                          tables, footnotes, ~~strike~~, task lists, autolinks
		.use(remarkMath) //                         $inline$ and $$display$$ math
		.use(remarkRehype, { allowDangerousHtml: true }) // markdown tree → HTML tree (keeps raw HTML you write)
		.use(rehypeKatex) //                        math → HTML via KaTeX
		.use(rehypeHighlight) //                    ```lang code blocks → highlighted code
		.use(rehypeSlug) //                         give every heading an id, e.g. "## Results" → id="results"
		.use(rehypeAutolinkHeadings, {
			behavior: 'append', //                  "#" link after each heading, shown on hover
			properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
			content: { type: 'text', value: '#' }
		})
		.use(collectToc)
		.use(imagesToFigures)
		.use(wrapTables)
		.use(addCopyButtons)
		.use(prefixBasePath, { base })
		.use(resolveRelativeAssets, { resolveAsset }) // after prefixBasePath: these URLs already include it
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);

	return { html: String(file), toc: (file.data.toc as TocItem[]) ?? [] };
}

/** Roughly how long the text takes to read, in minutes (same rule of thumb Hugo uses). */
export function readingTime(markdown: string): number {
	const words = markdown.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / 213));
}

// ---------------------------------------------------------------------------
// Small custom plugins. Each one walks the HTML tree and tweaks some elements.
// ---------------------------------------------------------------------------

/** Records every h2/h3 so a post can show a table of contents (`toc: true`). */
const collectToc: Plugin<[], Root> = () => (tree, file) => {
	const toc: TocItem[] = [];
	visit(tree, 'element', (node) => {
		const id = node.properties.id;
		// "footnote-label" is the automatic "Footnotes" heading, which doesn't belong in the TOC
		if ((node.tagName === 'h2' || node.tagName === 'h3') && id && id !== 'footnote-label') {
			// the heading text, minus the "#" anchor appended above
			const text = toString(node).replace(/#$/, '').trim();
			toc.push({ depth: Number(node.tagName[1]), id: String(id), text });
		}
	});
	file.data.toc = toc;
};

/**
 * An image on its own line becomes a figure. The optional title becomes the caption:
 *   ![alt text](/images/plot.png "Figure 1: my caption")
 */
const imagesToFigures: Plugin<[], Root> = () => (tree) => {
	visit(tree, 'element', (node, index, parent) => {
		if (node.tagName !== 'p' || !parent || index === undefined) return;

		const children = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
		const img = children[0];
		if (children.length !== 1 || img.type !== 'element' || img.tagName !== 'img') return;

		const caption = img.properties.title ? String(img.properties.title) : '';
		delete img.properties.title;
		img.properties.loading = 'lazy';

		const figure: Element = {
			type: 'element',
			tagName: 'figure',
			properties: {},
			children: [img]
		};
		if (caption) {
			figure.children.push({
				type: 'element',
				tagName: 'figcaption',
				properties: {},
				children: [{ type: 'text', value: caption }]
			});
		}
		parent.children[index] = figure;
		return SKIP;
	});
};

/** Wraps tables in a scrollable box so wide tables don't break the layout on phones. */
const wrapTables: Plugin<[], Root> = () => (tree) => {
	visit(tree, 'element', (node, index, parent) => {
		if (node.tagName !== 'table' || !parent || index === undefined) return;
		parent.children[index] = {
			type: 'element',
			tagName: 'div',
			properties: { className: ['table-wrapper'] },
			children: [node]
		};
		return SKIP;
	});
};

/** Adds a "copy" button to each code block. The click handling lives in Prose.svelte. */
const addCopyButtons: Plugin<[], Root> = () => (tree) => {
	visit(tree, 'element', (node) => {
		if (node.tagName !== 'pre') return;
		node.children.push({
			type: 'element',
			tagName: 'button',
			properties: { type: 'button', className: ['copy-code-button'] },
			children: [{ type: 'text', value: 'copy' }]
		});
		return SKIP;
	});
};

/**
 * Makes site-relative links like `/posts/foo/` or `/images/x.png` work when the
 * site is served from a sub-folder (e.g. GitHub Pages project sites).
 */
const prefixBasePath: Plugin<[{ base: string }], Root> = ({ base }) => (tree) => {
	if (!base) return;
	visit(tree, 'element', (node) => {
		for (const attr of ['href', 'src']) {
			const value = node.properties[attr];
			if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
				node.properties[attr] = base + value;
			}
		}
	});
};

/**
 * Replaces relative file references with the file's final URL:
 *   ![Plot](./plot.png)     → <img src="/_app/immutable/assets/plot.3f9a2c.png">
 *   [Data](./results.csv)   → <a href="/_app/immutable/assets/results.8b1e0d.csv">
 * A missing image stops the build with an error, so broken images never get published.
 */
const resolveRelativeAssets: Plugin<[{ resolveAsset: RenderOptions['resolveAsset'] }], Root> =
	({ resolveAsset }) =>
	(tree, file) => {
		// Anything that isn't a full URL ("https:", "mailto:"), site path ("/…") or anchor ("#…")
		const isRelative = (url: string) => !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url);

		visit(tree, 'element', (node) => {
			const attr = node.tagName === 'a' ? 'href' : 'src';
			const value = node.properties[attr];
			if (typeof value !== 'string' || !isRelative(value)) return;

			const url = resolveAsset(value);
			if (url) {
				node.properties[attr] = url;
			} else if (node.tagName === 'img' || node.tagName === 'video' || node.tagName === 'source') {
				file.fail(`Image or file not found: "${value}". It should be in the same folder as the markdown file.`);
			}
			// Other relative links (e.g. to another page) are left as they are.
		});
	};
