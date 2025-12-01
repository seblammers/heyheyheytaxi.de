<script lang="ts">
	import '@fontsource/zilla-slab/400-italic.css';
	import '@fontsource/zilla-slab/700-italic.css';
	import '@fontsource/zilla-slab/400.css';
	import '@fontsource/zilla-slab/700.css';

	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Hey, hey, hey, Taxi!</title>
</svelte:head>

<main>
	{@render children()}
</main>
