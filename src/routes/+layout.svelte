<script lang="ts">
	import '@fontsource/zilla-slab/400-italic.css';
	import '@fontsource/zilla-slab/700-italic.css';
	import '@fontsource/zilla-slab/400.css';
	import '@fontsource/zilla-slab/700.css';

	import './layout.css';
	import favicon from '#lib/assets/favicon.png';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Nav />
<main>
	{@render children()}
</main>
<Footer />
