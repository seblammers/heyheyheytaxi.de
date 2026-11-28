import {
	PUBLIC_SITE_URL,
	PUBLIC_SITE_TITLE,
	PUBLIC_SITE_DESCRIPTION,
	PUBLIC_RSS_ITEM_LIMIT
} from '$app/env/public';

// Values are checked on access instead of on import: the Docker build runs
// without env vars, so throwing at module level would break the build.
function required(name: string, value: string | undefined): string {
	if (!value) throw new Error(`${name} is not set – see .env.example`);
	return value;
}

/** Site-wide settings from the environment; shared by SEO tags, RSS, sitemap and robots.txt */
export const site = {
	/** Absolute URL without trailing slash (normalized in src/env.ts) */
	get url(): string {
		return required('PUBLIC_SITE_URL', PUBLIC_SITE_URL);
	},
	get title(): string {
		return required('PUBLIC_SITE_TITLE', PUBLIC_SITE_TITLE);
	},
	get description(): string {
		return required('PUBLIC_SITE_DESCRIPTION', PUBLIC_SITE_DESCRIPTION);
	},
	rssItemLimit: PUBLIC_RSS_ITEM_LIMIT,
	language: 'de'
};
