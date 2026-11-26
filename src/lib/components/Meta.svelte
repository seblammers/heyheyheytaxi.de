<script lang="ts">
	import ogImage from '#lib/assets/og-image.png';

	// Single source of truth for SEO tags. Render exactly once per page, because
	// <svelte:head> only appends tags and never replaces existing ones.
	const siteName = 'Hey, hey, hey, Taxi!';

	let {
		title,
		description = 'Hey, hey, hey, Taxi! ist eine Internetseite für all eure Taxi-Geschichten.',
		noindex = false
	}: { title?: string; description?: string; noindex?: boolean } = $props();

	// Subpages get the site name appended; the home page uses it alone
	const fullTitle = $derived(title ? `${title} | ${siteName}` : siteName);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title ?? siteName} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>
