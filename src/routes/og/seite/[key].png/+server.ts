import { error } from '@sveltejs/kit';
import { findPageSeo, siteName, defaultDescription } from '#lib/seo.ts';
import { renderOgImage } from '#lib/server/og.ts';
import type { RequestHandler } from './$types';

// Only known pages get an image, so nobody can render arbitrary text on our domain
export const GET: RequestHandler = async ({ params }) => {
	const seo = findPageSeo(params.key);
	if (!seo) error(404, 'Seite nicht gefunden');

	return renderOgImage(seo.title ?? siteName, seo.description ?? defaultDescription);
};
