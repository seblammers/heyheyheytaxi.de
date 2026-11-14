<script lang="ts">
	import { CarTaxiFront } from '@lucide/svelte';
	import { menuItems, footerItems } from '$lib/config';
	import { page } from '$app/state';
</script>

<footer class="bg-taxi-blue text-taxi-yellow w-full">
	<div class="nk-container flex flex-col gap-md py-sm! md:py-md! w-full">
		<nav
			class="flex gap-md justify-between items-start w-full"
			aria-label="Hauptnavigation (Fußzeile)"
		>
			<a href="/" class="flex items-center">
				<CarTaxiFront class="w-8 h-8" />
				<span class="sr-only">Startseite</span>
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
		</nav>

		<nav
			class="flex flex-wrap justify-end gap-sm md:gap-md pt-sm border-t border-taxi-yellow/30 text-sm"
			aria-label="Rechtliches"
		>
			{#each footerItems as item (item.href)}
				<a
					data-active={item.href === page.url.pathname}
					href={item.href}
					class="text-taxi-yellow/90 hover:text-taxi-yellow transition-colors data-[active=true]:font-semibold"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</div>
</footer>
