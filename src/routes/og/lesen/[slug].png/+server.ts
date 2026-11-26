import { error } from '@sveltejs/kit';
import { supabase } from '#lib/server/supabase.ts';
import { storyDescription } from '#lib/seo.ts';
import { renderOgImage } from '#lib/server/og.ts';
import type { RequestHandler } from './$types';

// Only approved stories get an image: pending or rejected titles must not be
// publicly rendered (moderation hasn't cleared them)
export const GET: RequestHandler = async ({ params }) => {
	const { data: post, error: dbError } = await supabase
		.from('posts')
		.select('title')
		.eq('slug', params.slug)
		.eq('status', 'approved')
		.maybeSingle();

	if (dbError) {
		console.error('[og/lesen] Error:', dbError);
		error(500, 'Bild konnte nicht erstellt werden');
	}
	if (!post) error(404, 'Geschichte nicht gefunden');

	return renderOgImage(post.title, storyDescription);
};
