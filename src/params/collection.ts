import type { ParamMatcher } from '@sveltejs/kit';
import { collections, type CollectionName } from '$lib/config';

/**
 * Only lets `[collection=collection]` routes match names listed in `collections`
 * (posts, talks, …), so /about/ goes to the standalone-page route instead.
 */
export const match = ((param: string): param is CollectionName =>
	Object.hasOwn(collections, param)) satisfies ParamMatcher;
