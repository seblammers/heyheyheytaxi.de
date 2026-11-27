<script lang="ts">
	import noHeySvg from '#lib/assets/taxi-logo-drive-no-hey.svg?raw';
	import heySvg from '#lib/assets/taxi-logo-drive-hey.svg?raw';
	import heyHeySvg from '#lib/assets/taxi-logo-drive-hey-hey.svg?raw';
	import heyHeyHeySvg from '#lib/assets/taxi-logo-drive-hey-hey-hey.svg?raw';

	let { size = 160, class: className = '' }: { size?: number; class?: string } = $props();

	// Each step's SVG only adds paths to the previous one, so diffing them yields
	// one layer per step (car, left bubble, right bubble, middle "hey") that can be
	// animated in independently while the assets stay the single source of truth.
	function pathsOf(svg: string) {
		return [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((match) => match[1]);
	}

	const steps = [noHeySvg, heySvg, heyHeySvg, heyHeyHeySvg].map(pathsOf);
	const layers = steps.map((paths, i) => {
		const previous = new Set(steps[i - 1] ?? []);
		return paths.filter((d) => !previous.has(d));
	});

	// Transform origins point at each bubble's tail, so it "pops out" of the taxi
	const layerClasses = ['car', 'bubble bubble-left', 'bubble bubble-right', 'bubble bubble-middle'];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 161.4 213.3"
	width={size}
	height={(size * 213.3) / 161.4}
	fill="currentColor"
	aria-hidden="true"
	class={['taxi-hey-intro', className]}
>
	{#each layers as paths, i (i)}
		<g class={layerClasses[i]} style:--step={i}>
			{#each paths as d (d)}
				<path {d} />
			{/each}
		</g>
	{/each}
</svg>

<style>
	/* The bubbles touch the viewBox edge, so their bounce overshoot would get clipped */
	.taxi-hey-intro {
		overflow: visible;
	}

	g {
		transform-box: fill-box;
	}

	.car {
		transform-origin: center bottom;
		animation: drive-in 700ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both;
	}

	.bubble {
		animation: pop-in 450ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
		/* Car first, then one bubble every 500ms */
		animation-delay: calc(400ms + var(--step) * 500ms);
	}

	.bubble-left {
		transform-origin: 85% 95%;
	}

	.bubble-right {
		transform-origin: 15% 95%;
	}

	.bubble-middle {
		transform-origin: center bottom;
	}

	@keyframes drive-in {
		from {
			opacity: 0;
			transform: translateY(12%) scale(0.85);
		}
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: scale(0.2);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		g {
			animation: none !important;
		}
	}
</style>
