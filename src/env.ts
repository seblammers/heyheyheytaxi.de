import { defineEnvVars } from '@sveltejs/kit/env';

// All variables are declared optional on purpose: SvelteKit validates them during
// the build too, and the Docker build runs without any env vars. Required values
// are checked where they are used (e.g. src/lib/server/supabase.ts).
const optional = (input: string | undefined) => input;

// Normalized here so every consumer can append paths without double slashes
const siteUrl = (input: string | undefined) => input?.replace(/\/+$/, '') || undefined;

const rssItemLimit = (input: string | undefined) => {
	if (!input) return 50;
	const limit = Number(input);
	if (!Number.isInteger(limit) || limit < 1) {
		throw new Error('PUBLIC_RSS_ITEM_LIMIT must be a positive integer');
	}
	return limit;
};

export const variables = defineEnvVars({
	RESEND_WEBHOOK_SECRET: { schema: optional },
	NOTIFY_TO_EMAIL: { schema: optional },
	NOTIFY_FROM_EMAIL: { schema: optional },
	RESEND_API_KEY: { schema: optional },
	PUBLIC_SUPABASE_URL: { public: true, schema: optional },
	PUBLIC_SUPABASE_ANON_KEY: { public: true, schema: optional },
	PUBLIC_SITE_URL: {
		public: true,
		schema: siteUrl,
		description: 'Absolute site URL without trailing slash, e.g. https://heyheyheytaxi.de'
	},
	PUBLIC_SITE_TITLE: { public: true, schema: optional },
	PUBLIC_SITE_DESCRIPTION: { public: true, schema: optional },
	PUBLIC_RSS_ITEM_LIMIT: {
		public: true,
		schema: rssItemLimit,
		description: 'Maximum number of stories in /rss.xml (default 50)'
	}
});
