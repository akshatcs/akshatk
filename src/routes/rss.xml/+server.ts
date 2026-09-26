// RSS feed of all posts at /rss.xml, for feed readers.
import { resolve } from '$app/paths';
import { site } from '$lib/config';
import { getCollection } from '$lib/server/content';
import { entryUrl } from '$lib/utils/urls';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	const items = getCollection('posts')
		.map((post) => {
			const url = site.url + entryUrl(post);
			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${url}</link>
			<guid>${url}</guid>
			${post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ''}
			${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
		</item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>${escapeXml(site.title)}</title>
		<link>${site.url + resolve('/')}</link>
		<description>${escapeXml(site.description)}</description>${items}
	</channel>
</rss>`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

function escapeXml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}
