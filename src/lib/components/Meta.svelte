<script lang="ts">
	import { page } from '$app/state';
	import ogImageFallback from '#lib/assets/og-image.png';
	import { site } from '#lib/site.ts';

	// Single source of truth for SEO tags. Render exactly once per page, because
	// <svelte:head> only appends tags and never replaces existing ones.
	let {
		title,
		description = site.description,
		image,
		noindex = false
	}: {
		title?: string;
		description?: string;
		/** Path of a generated OG image, e.g. from pageSeo(); falls back to the static one */
		image?: string;
		noindex?: boolean;
	} = $props();

	// Subpages get the site name appended; the home page uses it alone
	const fullTitle = $derived(title ? `${title} | ${site.title}` : site.title);

	// Generated images are cached as immutable, so the URL must change with the text.
	// A short string hash is enough to bust caches; it doesn't need to be secure.
	function hashText(text: string) {
		let hash = 0;
		for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) | 0;
		return (hash >>> 0).toString(36);
	}

	// Social platforms require absolute image URLs
	const imageUrl = $derived(
		image
			? `${page.url.origin}${image}?v=${hashText(`${title}|${description}`)}`
			: new URL(ogImageFallback, page.url.origin).href
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title ?? site.title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={`${page.url.origin}${page.url.pathname}`} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>
