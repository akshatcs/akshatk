/**
 * Site-wide settings. Most day-to-day changes (name, links, menu, page sizes)
 * happen here - no need to touch components.
 */
import type { IconName } from '$lib/components/icons';

export const site = {
	/** Shown in the header, browser tab and RSS feed. */
	title: 'Akshat Kumar',
	author: 'Akshat Kumar',
	description: 'Personal website of Akshat Kumar.',

	/**
	 * Domain the site is served from - no trailing slash, no sub-folder.
	 * Only used for absolute links (RSS feed, link previews).
	 * Update it once you know your domain.
	 */
	url: 'https://akshatk.com',

	/** How many posts the homepage lists. Set to `Infinity` to show all of them. */
	homePostCount: 10,

	/** Entries per page on /posts, /talks, /projects, etc. */
	pageSize: 10
};

/** Top menu. Order here is the order on screen. */
export const nav = [
	{ label: '/home', href: '/' },
	{ label: '/posts', href: '/posts/' },
	// { label: '/projects', href: '/projects/' },
	// { label: '/talks', href: '/talks/' },
	{ label: '/about', href: '/about/' }
];

/** Icons under the homepage intro. Remove a line to hide that icon. */
export const socials: { icon: IconName; label: string; href: string }[] = [
	{ icon: 'github', label: 'GitHub', href: 'https://github.com/akshatcs/' },
	{ icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/akshatcse/' },
	{ icon: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
];

/**
 * Collections are folders of markdown files under `src/content/`.
 * Each one automatically gets a paginated list page at `/<name>/` and one page
 * per file at `/<name>/<file-name>/`.
 *
 * To add a new collection (e.g. "notes"):
 *   1. create `src/content/notes/` and put `.md` files in it
 *   2. add an entry below
 *   3. (optional) add it to `nav` above
 */
export const collections = {
	posts: { title: 'Posts', intro: '' },
	talks: { title: 'Talks', intro: 'Summaries and slides of talks I have given.' },
	projects: { title: 'Projects', intro: 'Things I have built or am building.' }
} satisfies Record<string, { title: string; intro: string }>;

export type CollectionName = keyof typeof collections;
export const collectionNames = Object.keys(collections) as CollectionName[];
