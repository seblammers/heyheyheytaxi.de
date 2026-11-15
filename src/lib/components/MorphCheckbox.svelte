<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { MorphIcon } from 'morphicons/svelte';
	import { Square, SquareCheckBig } from 'lucide';

	let {
		checked = $bindable(false),
		class: className = '',
		...rest
	}: HTMLInputAttributes = $props();
</script>

<!-- Wrapper is exactly one line tall so the icon centers on the label's first text line -->
<span class="relative inline-flex h-[1lh] shrink-0 items-center {className}">
	<!-- Native input stays in the DOM (visually hidden) for form submission, validation and a11y -->
	<input {...rest} type="checkbox" bind:checked class="peer sr-only" />
	<span
		class="text-taxi-blue rounded-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-taxi-blue"
	>
		<MorphIcon icon={checked ? SquareCheckBig : Square} spring="snappy" size="1.25em" />
	</span>
</span>
