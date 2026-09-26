// Build every page to static HTML at build time (needed for GitHub Pages).
export const prerender = true;

// URLs end in "/" (e.g. /posts/), so each page is saved as <route>/index.html.
// This works the same on GitHub Pages, any static host, or a Node server.
export const trailingSlash = 'always';
