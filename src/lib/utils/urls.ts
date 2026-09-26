/**
 * All internal URLs are built here, so links stay correct if the route
 * structure changes or the site is served from a sub-folder.
 */
import { resolve } from '$app/paths';
import type { CollectionName } from '$lib/config';
import type { EntryMeta } from '$lib/types';

/** e.g. /posts/hello-world/ */
export function entryUrl(entry: EntryMeta): string {
	return withSlash(
		resolve('/[collection=collection]/[slug]', {
			collection: entry.collection as CollectionName,
			slug: entry.slug
		})
	);
}

/** e.g. /posts/ for page 1, /posts/page/2/ for page 2 */
export function collectionUrl(collection: CollectionName, page = 1): string {
	return withSlash(
		page === 1
			? resolve('/[collection=collection]', { collection })
			: resolve('/[collection=collection]/page/[page]', { collection, page: String(page) })
	);
}

/** Every page URL ends in "/" (see `trailingSlash` in src/routes/+layout.ts). */
function withSlash(path: string): string {
	return path.endsWith('/') ? path : path + '/';
}
