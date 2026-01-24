<script lang="ts">
	import { CarTaxiFront } from '@lucide/svelte';
	import { menuItems } from '$lib/config';
	import { page } from '$app/state';
</script>

<nav class="bg-taxi-blue text-taxi-yellow w-full">
	<div
		class="nk-container flex gap-md justify-between nk-container items-start py-sm! md:py-md! w-full"
	>
		<a href="/" class="flex items-center">
			<CarTaxiFront class="w-8 h-8" />
		</a>

		<div class="flex flex-col sm:flex-row items-start flex-wrap gap-sm md:gap-md">
			{#each menuItems as item (item.href)}
				<a
					data-active={item.href === page.url.pathname}
					href={item.href}
					class="text-taxi-yellow hover:text-taxi-yellow/80 transition-colors data-[active=true]:font-semibold"
				>
					{item.label}
				</a>
			{/each}
		</div>
	</div>
</nav>
