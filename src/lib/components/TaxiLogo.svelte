<script lang="ts">
	import { MorphIcon } from 'morphicons/svelte';
	import { svgToIcon } from 'morphicons/adapters';
	import taxiDefaultSvg from '$lib/assets/taxi-default.svg?raw';
	import taxiWinkSvg from '$lib/assets/taxi-wink.svg?raw';

	// Parsed once per module; svgToIcon is DOM-free, so this also runs during SSR
	const taxiDefault = svgToIcon(taxiDefaultSvg);
	const taxiWink = svgToIcon(taxiWinkSvg);

	// How long the wink stays visible after a tap (touch has no hover-out)
	const TAP_WINK_MS = 700;

	let { size = 32 }: { size?: number } = $props();

	let winking = $state(false);
	let tapTimer: ReturnType<typeof setTimeout> | undefined;

	function onPointerEnter(event: PointerEvent) {
		if (event.pointerType === 'mouse') winking = true;
	}

	function onPointerLeave(event: PointerEvent) {
		if (event.pointerType === 'mouse') winking = false;
	}

	function onPointerDown(event: PointerEvent) {
		if (event.pointerType === 'mouse') return;
		winking = true;
		clearTimeout(tapTimer);
		tapTimer = setTimeout(() => (winking = false), TAP_WINK_MS);
	}

	$effect(() => () => clearTimeout(tapTimer));
</script>

<span
	class="inline-flex"
	role="presentation"
	onpointerenter={onPointerEnter}
	onpointerleave={onPointerLeave}
	onpointerdown={onPointerDown}
>
	<MorphIcon icon={winking ? taxiWink : taxiDefault} spring="snappy" {size} />
</span>
