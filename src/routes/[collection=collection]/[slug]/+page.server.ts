// A single entry, e.g. /posts/hello-world/.
import { collectionNames } from '$lib/config';
import { getCollection, getCollectionEntry } from '$lib/server/content';

/** Tells the static build which entries exist. */
export function entries() {
	return collectionNames.flatMap((collection) =>
		getCollection(collection).map((entry) => ({ collection, slug: entry.slug }))
	);
}

export function load({ params }) {
	return getCollectionEntry(params.collection, params.slug);
}
