import { error } from '@sveltejs/kit';
import { site } from '#lib/site.ts';
import { supabase } from '#lib/server/supabase.ts';
import { sanitizeStoryHtml } from '#lib/server/utils/sanitize.ts';

/** Shared headers for RSS and sitemap: no browser cache, one hour on the CDN */
export const FEED_CACHE_CONTROL = 'max-age=0, s-maxage=3600';

export function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** Wraps text in CDATA; a literal "]]>" would end the section early, so it's split up */
export function cdata(text: string): string {
	return `<![CDATA[${text.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export function absoluteUrl(path: string): string {
	return `${site.url}${path}`;
}

/** Single place for story URLs, so RSS and sitemap can't drift apart */
export function postUrl(slug: string): string {
	// Not resolve(): during a request it returns a path relative to the current page
	return absoluteUrl(`/lesen/${encodeURIComponent(slug)}`);
}

/** Plain-text teaser from sanitized story HTML */
export function excerpt(html: string, maxLength = 280): string {
	const text = html
		// Block tags become spaces so paragraphs don't run together
		.replace(/<[^>]+>/g, ' ')
		// sanitize-html only encodes these three in text nodes; &amp; must go last
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= maxLength) return text;
	const cut = text.slice(0, maxLength);
	return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
}

export type FeedPost = {
	slug: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date | null;
};

/**
 * Approved stories, newest first. Only approved posts are public; pending and
 * rejected ones must never show up in a feed. Content is sanitized on read,
 * same as in src/routes/lesen/data.remote.ts.
 */
export async function getPublishedPosts(limit?: number): Promise<FeedPost[]> {
	let request = supabase
		.from('posts')
		.select('slug, title, content, created_at, updated_at')
		.eq('status', 'approved')
		.order('created_at', { ascending: false });
	if (limit) request = request.limit(limit);

	const { data, error: dbError } = await request;
	if (dbError) {
		console.error('[getPublishedPosts] Error:', dbError);
		error(500, 'Die Geschichten konnten nicht geladen werden.');
	}

	return (data ?? []).map((post) => ({
		slug: post.slug,
		title: post.title,
		content: sanitizeStoryHtml(post.content),
		createdAt: new Date(post.created_at),
		updatedAt: post.updated_at ? new Date(post.updated_at) : null
	}));
}
