<script lang="ts">
	// Rendered by Satori, not a browser: only inline styles and flexbox work, and
	// CSS variables are unavailable, so the brand colors are repeated here.
	const taxiYellow = '#ffdf20';
	const taxiBlue = '#1c398e';

	let { title, description }: { title: string; description: string } = $props();

	// Story titles can be up to 200 characters; shrink long ones so they still fit
	const titleSize = $derived(title.length > 80 ? 52 : title.length > 40 ? 64 : 76);
</script>

<div
	style="display: flex; flex-direction: column; justify-content: center; width: 100%; height: 100%; padding: 0 110px; gap: 28px; background-color: {taxiYellow}; color: {taxiBlue}; font-family: 'Zilla Slab';"
>
	<div style="display: flex; font-size: {titleSize}px; font-weight: 700; line-height: 1.1;">
		{title}
	</div>
	<div style="display: flex; font-size: 34px; font-weight: 400; line-height: 1.4;">
		{description}
	</div>
</div>
