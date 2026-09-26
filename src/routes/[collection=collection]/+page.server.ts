// List page for a collection, e.g. /posts/ (page 1).
import { site, collectionNames } from '$lib/config';
import { getCollectionPage } from '$lib/server/content';

/** Tells the static build which collections exist. */
export function entries() {
	return collectionNames.map((collection) => ({ collection }));
}

export function load({ params }) {
	return { collection: params.collection, ...getCollectionPage(params.collection, 1, site.pageSize) };
}
