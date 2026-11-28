import { error } from '@sveltejs/kit';
import { findPageSeo } from '#lib/seo.ts';
import { site } from '#lib/site.ts';
import { renderOgImage } from '#lib/server/og.ts';
import type { RequestHandler } from './$types';

// Only known pages get an image, so nobody can render arbitrary text on our domain
export const GET: RequestHandler = async ({ params }) => {
	const seo = findPageSeo(params.key);
	if (!seo) error(404, 'Seite nicht gefunden');

	return renderOgImage(seo.title ?? site.title, seo.description ?? site.description);
};
