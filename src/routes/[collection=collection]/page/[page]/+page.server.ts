// Further list pages for a collection, e.g. /posts/page/2/.
import { site, collectionNames } from '$lib/config';
import { getCollection, getCollectionPage } from '$lib/server/content';

/** Tells the static build which page numbers exist (page 1 is the plain /posts/ route). */
export function entries() {
	return collectionNames.flatMap((collection) => {
		const totalPages = Math.ceil(getCollection(collection).length / site.pageSize);
		return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
			collection,
			page: String(i + 2)
		}));
	});
}

export function load({ params }) {
	return {
		collection: params.collection,
		...getCollectionPage(params.collection, Number(params.page), site.pageSize)
	};
}
