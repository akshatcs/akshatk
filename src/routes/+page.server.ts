import { site } from '$lib/config';
import { getCollection } from '$lib/server/content';

export function load() {
	return {
		posts: getCollection('posts').slice(0, site.homePostCount)
	};
}
