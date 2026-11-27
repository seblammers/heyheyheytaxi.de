<script lang="ts">
	import '@fontsource/zilla-slab/400-italic.css';
	import '@fontsource/zilla-slab/700-italic.css';
	import '@fontsource/zilla-slab/400.css';
	import '@fontsource/zilla-slab/700.css';

	import './layout.css';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children } = $props();
</script>

<Nav />
<main>
	{@render children()}
</main>
<Footer />
