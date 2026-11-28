import { navGroups } from '#lib/config.ts';
import {
	FEED_CACHE_CONTROL,
	absoluteUrl,
	escapeXml,
	getPublishedPosts,
	postUrl
} from '#lib/server/feed-utils.ts';
import type { RequestHandler } from './$types';

// Home plus the content pages from the menu. Impressum and Datenschutz are
// noindex, edit pages, API, webhook and OG image routes are not meant for search.
const staticPaths = ['/', ...navGroups.flatMap((group) => group.items.map((i) => i.href))];

function renderUrl(loc: string, lastmod?: Date): string {
	const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : '';
	return `
	<url>
		<loc>${escapeXml(loc)}</loc>${lastmodTag}
	</url>`;
}

export const GET: RequestHandler = async () => {
	// A sitemap holds at most 50,000 URLs; beyond that this needs to become a
	// sitemap index. Note that Supabase caps a single request at 1,000 rows by
	// default, which would truncate the list even earlier.
	const posts = await getPublishedPosts();

	const urls = [
		// Static pages have no reliable change date, so lastmod is omitted
		...staticPaths.map((path) => renderUrl(absoluteUrl(path))),
		...posts.map((post) => renderUrl(postUrl(post.slug), post.updatedAt ?? post.createdAt))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': FEED_CACHE_CONTROL
		}
	});
};
