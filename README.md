# akshatk

My personal website: blog posts, talks, projects. Built with [SvelteKit](https://svelte.dev/docs/kit) as a fully static site.

## Commands

```sh
npm install        # once, after cloning
npm run dev        # local server with live reload at http://localhost:3000
npm run build      # build the static site into build/
npm run preview    # serve the built site locally, to check it before deploying
npm run check      # type-check everything
```

## Writing

The rule of thumb:

- **Things there are many of, each with its own page** (posts, talks, projects) are markdown files in `src/content/`. Adding one needs no code.
- **One-off pages** (homepage intro, about) are written directly in their route folder in `src/routes/`, as HTML.

### Posts with images

When a post has images (or data, PDFs, videos), make it a folder and keep them together:

```
src/content/posts/
├── hello-world.md             ← a post without images can stay a single file
└── my-experiment/
    ├── index.md               ← the post; URL is /posts/my-experiment/
    ├── setup.jpg
    └── results.png
```

In `index.md`, refer to them with relative paths:

```md
![Experimental setup](./setup.jpg "Figure 1: The setup.")
[Download the raw data](./results.csv)
```

- File names only need to be unique within their own folder. Every post can have its own `figure1.png`.
- At build time each file gets a content hash in its name, so browsers always get the latest version.
- A missing or misspelled image stops the build with an error naming the file, so broken images never get published.
- Allowed file types are listed in `assetFiles` in `src/lib/server/content.ts`.
- Compress large photos before adding them (e.g. export as JPEG/WebP at ~2000px wide); the build copies files as they are.

Every file starts with frontmatter:

```yaml
---
title: My Post         # required
date: 2026-09-26       # posts/projects: used for sorting and display
summary: One line.     # optional, shown under the title and in RSS
toc: true              # optional, adds a table of contents
draft: true            # optional, visible in `npm run dev` only
---
```

[`src/content/posts/writing-guide/index.md`](src/content/posts/writing-guide/index.md) demonstrates everything: maths, code, figures with captions, tables, footnotes.

### Maths

Write LaTeX between `$…$` (inline) or `$$…$$` (display). It's rendered by [KaTeX](https://katex.org/docs/supported) at build time.

## Customising

- **Name, menu, social links, page sizes**: [`src/lib/config.ts`](src/lib/config.ts)
- **Colours, fonts, spacing, dark mode**: the "Design tokens" section at the top of [`src/app.css`](src/app.css)
- **Markdown features**: [`src/lib/server/markdown.ts`](src/lib/server/markdown.ts)

### Adding a new section (e.g. "notes")

1. Create `src/content/notes/` and add markdown files.
2. Add `notes: { title: 'Notes', intro: '' }` to `collections` in `src/lib/config.ts`.
3. Add `{ label: '/notes', href: '/notes/' }` to `nav` in the same file.

It gets a paginated list at `/notes/` and a page per file automatically.

### Adding a one-off page (e.g. /now/)

1. Copy `src/routes/about/` to `src/routes/now/`.
2. Edit the text in `src/routes/now/+page.svelte`. Keep the `<Page title="…">` wrapper so it looks like the rest of the site.
3. Add `{ label: '/now', href: '/now/' }` to `nav` in `src/lib/config.ts` if it should appear in the menu.

For a page with its own layout (e.g. a photo grid), write any Svelte you like inside the route and reuse components from `src/lib/components/`. See the [routing docs](https://svelte.dev/docs/kit/routing).


In each route folder, `+page.server.ts` loads the data (runs at build time) and `+page.svelte` displays it.

## Deploying

The site is served from the custom domain `akshatk.com` via GitHub Pages. Pushing to `main` builds and publishes it automatically ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)); progress and errors show up in the repo's **Actions** tab.

One-time setup:

1. **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. **Settings → Pages → Custom domain**: enter `akshatk.com`, save, and tick **Enforce HTTPS** once it's available. (No `CNAME` file is needed; GitHub ignores it when deploying via Actions.)
3. At your domain registrar, add DNS records:
   - `A` records for `akshatk.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `akshatcs.github.io`
4. `url` in `src/lib/config.ts` must match the domain (it's used for the RSS feed and link previews).

GitHub Pages is only available for **public** repos on a free GitHub plan.

**On a server later**: `npm i -D @sveltejs/adapter-node`, then swap `adapterStatic(...)` for `adapterNode()` in `vite.config.ts`. Pages and content stay the same.

