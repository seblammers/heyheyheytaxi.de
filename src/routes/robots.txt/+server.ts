import type { RequestHandler } from './$types';

// Only the production domain may be indexed. dev.heyheyheytaxi.de, previews and
// localhost run the same code, so a static robots.txt can't tell them apart.
const PRODUCTION_HOST = 'heyheyheytaxi.de';

export const GET: RequestHandler = ({ url }) => {
	const body =
		url.hostname === PRODUCTION_HOST
			? ['User-agent: *', 'Disallow: /lesen/*/bearbeiten', ''].join('\n')
			: [
					'# Not the production site – disallow all crawling',
					'User-agent: *',
					'Disallow: /',
					''
				].join('\n');

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};
