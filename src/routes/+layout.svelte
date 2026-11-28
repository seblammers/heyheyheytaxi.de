<script lang="ts">
	import '@fontsource/zilla-slab/400-italic.css';
	import '@fontsource/zilla-slab/700-italic.css';
	import '@fontsource/zilla-slab/400.css';
	import '@fontsource/zilla-slab/700.css';

	import './layout.css';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { site } from '#lib/site.ts';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title={site.title} href="/rss.xml" />
</svelte:head>

<Nav />
<main>
	{@render children()}
</main>
<Footer />
