import { site } from '#lib/site.ts';
import {
	FEED_CACHE_CONTROL,
	absoluteUrl,
	cdata,
	escapeXml,
	excerpt,
	getPublishedPosts,
	postUrl,
	type FeedPost
} from '#lib/server/feed-utils.ts';
import type { RequestHandler } from './$types';

const lastChange = (post: FeedPost) => post.updatedAt ?? post.createdAt;

function renderItem(post: FeedPost): string {
	const link = escapeXml(postUrl(post.slug));
	return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${link}</link>
			<guid isPermaLink="true">${link}</guid>
			<pubDate>${post.createdAt.toUTCString()}</pubDate>
			<description>${escapeXml(excerpt(post.content))}</description>
			<content:encoded>${cdata(post.content)}</content:encoded>
		</item>`;
}

export const GET: RequestHandler = async () => {
	const posts = await getPublishedPosts(site.rssItemLimit);

	// Newest change across the listed stories; omitted for an empty feed instead of faking "now"
	const newest = posts.map(lastChange).sort((a, b) => b.getTime() - a.getTime())[0];
	const lastBuildDate = newest ? `<lastBuildDate>${newest.toUTCString()}</lastBuildDate>` : '';

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>${escapeXml(site.title)}</title>
		<link>${escapeXml(absoluteUrl('/'))}</link>
		<description>${escapeXml(site.description)}</description>
		<atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
		<language>${site.language}</language>
		${lastBuildDate}${posts.map(renderItem).join('')}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': FEED_CACHE_CONTROL
		}
	});
};
