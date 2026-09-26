import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},

			// Build the whole site as static HTML files into `build/`.
			// To run on a server later, swap this for @sveltejs/adapter-node — nothing else needs to change.
			adapter: adapterStatic({
				pages: 'build',
				assets: 'build',
				// Unknown URLs get this page, which shows the 404 error page (GitHub Pages serves 404.html automatically).
				fallback: '404.html',
				strict: true
			}),

			prerender: {
				// "/posts/page/2/" etc. only exist once there are enough posts, so it's fine for that
				// route to produce no pages. Any other route that isn't built is still an error.
				handleUnseenRoutes: ({ routes, message }) => {
					if (routes.some((route) => route !== '/[collection=collection]/page/[page]')) {
						throw new Error(message);
					}
				}
			},

			paths: {
				// Sub-folder the site is served from. Empty (the default) for a custom domain like akshatk.com.
				// Only needed when serving from a sub-folder such as <user>.github.io/<repo>/:
				// then build with the environment variable BASE_PATH=/<repo>.
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`,
				// Always generate absolute links (e.g. "/posts/") rather than relative ones ("../posts/").
				relative: false
			}
		})
	],
	build: {
		// Vite normally embeds small files (< 4 kB) directly in the page. Keep post images as
		// separate files instead, so pages stay small and browsers can cache images.
		assetsInlineLimit: (filePath) => (filePath.includes('/src/content/') ? false : undefined)
	},
	server: {
		port: 3000
	}
});
