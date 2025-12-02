<script lang="ts">
	import '@fontsource/zilla-slab/400-italic.css';
	import '@fontsource/zilla-slab/700-italic.css';
	import '@fontsource/zilla-slab/400.css';
	import '@fontsource/zilla-slab/700.css';

	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import ogImage from '$lib/assets/og-image.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:image" content={ogImage} />
	<title>Hey, hey, hey, Taxi!</title>
	<meta
		name="description"
		content="Hey, hey, hey, Taxi! ist eine Internetseite für all eure Taxi-Geschichten."
	/>
</svelte:head>

<main>
	{@render children()}
</main>
