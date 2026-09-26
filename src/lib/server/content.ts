/**
 * Reads the markdown files in `src/content/` (posts, talks, projects) and turns them into
 * data for pages. One-off pages like /about/ don't use this; they're written directly in
 * `src/routes/`.
 *
 * Every markdown file starts with a "frontmatter" block of settings, e.g.
 *
 *   ---
 *   title: My First Post
 *   date: 2026-09-26
 *   summary: Optional one-line description shown under the title.
 *   draft: true        # optional — drafts show up in `npm run dev` but are left out of the built site
 *   toc: true          # optional — show a table of contents
 *   ---
 *
 * A post can be a single file or a folder (to keep its images next to it):
 *
 *   posts/hello-world.md           → /posts/hello-world/
 *   posts/my-post/index.md         → /posts/my-post/
 *   posts/my-post/plot.png           referenced in index.md as ![alt](./plot.png)
 */
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { resolve } from '$app/paths';
import type { CollectionName } from '$lib/config';
import type { EntryMeta, Entry } from '$lib/types';
import { renderMarkdown, readingTime } from './markdown';

// Vite loads every markdown file under src/content/ as a plain string at build time.
const markdownFiles = import.meta.glob<string>('/src/content/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

// Images and other files that sit next to the markdown. Vite copies each one into the
// build with a content hash in its name (e.g. plot.3f9a2c.png) and gives us its final URL.
// Only the URL string is loaded here, not the file itself. Add an extension here if you need one.
const assetFiles = import.meta.glob<string>(
	'/src/content/**/*.{png,jpg,jpeg,gif,webp,avif,svg,pdf,mp4,webm,csv,zip}',
	{ query: '?url', import: 'default', eager: true }
);

interface SourceFile {
	meta: EntryMeta;
	body: string;
	/** Folder the markdown file is in, used to find its images. e.g. "/src/content/posts/my-post" */
	dir: string;
}

/** Parses one file. `path` looks like "/src/content/posts/hello-world.md". */
function parseFile(path: string, raw: string): SourceFile {
	// Split the "---" frontmatter block from the markdown body.
	const file = new VFile(raw);
	matter(file, { strip: true });
	const data = (file.data.matter ?? {}) as Record<string, unknown>;
	const content = String(file);

	// "posts/hello-world.md" and "posts/hello-world/index.md" both become
	// collection "posts", slug "hello-world".
	const parts = path.replace('/src/content/', '').replace(/\.md$/, '').split('/');
	if (parts.length > 1 && parts.at(-1) === 'index') parts.pop();
	const slug = parts.pop()!;
	const collection = parts.join('/');

	if (!data.title) throw new Error(`${path}: missing "title" in frontmatter`);

	return {
		meta: {
			collection,
			slug,
			title: String(data.title),
			summary: data.summary ? String(data.summary) : undefined,
			// Stored as an ISO string (e.g. "2026-09-26T00:00:00.000Z") so it can be sent to the browser.
			date: data.date ? new Date(String(data.date)).toISOString() : undefined,
			draft: data.draft === true,
			toc: data.toc === true,
			readingTime: readingTime(content)
		},
		body: content,
		dir: path.slice(0, path.lastIndexOf('/'))
	};
}

/** Every published file, parsed once and sorted newest first. */
const allFiles: SourceFile[] = Object.entries(markdownFiles)
	.map(([path, raw]) => parseFile(path, raw))
	.filter((file) => dev || !file.meta.draft)
	.sort((a, b) => (b.meta.date ?? '').localeCompare(a.meta.date ?? ''));

// Two files that map to the same URL (e.g. `posts/x.md` and `posts/x/index.md`) is a mistake.
const seen = new Set<string>();
for (const { meta } of allFiles) {
	const key = `${meta.collection}/${meta.slug}`;
	if (seen.has(key)) throw new Error(`Two content files both map to "${key}". Rename one of them.`);
	seen.add(key);
}

function findFile(folder: string, slug: string): SourceFile {
	const file = allFiles.find((f) => f.meta.collection === folder && f.meta.slug === slug);
	if (!file) error(404, 'Not found');
	return file;
}

// The site's base path: "" normally, or e.g. "/my-repo" when hosted in a sub-folder.
const basePath = resolve('/').replace(/\/$/, '');

async function toEntry(file: SourceFile): Promise<Entry> {
	const { html, toc } = await renderMarkdown(file.body, {
		base: basePath,
		// Turns "./plot.png" (relative to the markdown file) into the image's final URL.
		resolveAsset: (relativePath) => {
			const fullPath = new URL(relativePath, `file://${file.dir}/`).pathname;
			return assetFiles[decodeURIComponent(fullPath)];
		}
	});
	return { ...file.meta, html, tocItems: toc };
}

/** All entries of a collection, newest first (metadata only — no rendered HTML). */
export function getCollection(name: CollectionName): EntryMeta[] {
	return allFiles.filter((f) => f.meta.collection === name).map((f) => f.meta);
}

/** One page of a collection's list. Page numbers start at 1. */
export function getCollectionPage(name: CollectionName, page: number, pageSize: number) {
	const entries = getCollection(name);
	const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
	if (!Number.isInteger(page) || page < 1 || page > totalPages) error(404, 'Not found');

	return {
		entries: entries.slice((page - 1) * pageSize, page * pageSize),
		page,
		totalPages
	};
}

/** A single collection entry (e.g. one blog post) with its rendered HTML and its neighbours. */
export async function getCollectionEntry(name: CollectionName, slug: string) {
	const entry = await toEntry(findFile(name, slug));

	// Neighbours in date order, for the "← older / newer →" links at the bottom of a post.
	const list = getCollection(name);
	const index = list.findIndex((e) => e.slug === slug);
	return {
		entry,
		older: list[index + 1] ?? null,
		newer: list[index - 1] ?? null
	};
}
