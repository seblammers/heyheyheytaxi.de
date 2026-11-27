<script lang="ts">
	import { resolve } from '$app/paths';
	import TaxiLogo from './TaxiLogo.svelte';
	import { navGroups, legalItems } from '#lib/config.ts';
	import { page } from '$app/state';
</script>

<footer class="bg-taxi-blue text-taxi-yellow w-full">
	<!-- Shared grid so both navs start at the same column edge on mobile -->
	<div
		class="nk-container grid grid-cols-[auto_auto] justify-between gap-md py-sm! md:py-md! w-full"
	>
		<nav
			class="col-span-2 grid grid-cols-subgrid items-start"
			aria-label="Hauptnavigation (Fußzeile)"
		>
			<a href={resolve('/')} class="flex items-center">
				<TaxiLogo />
				<span class="sr-only">Startseite</span>
			</a>

			<div class="flex flex-col sm:flex-row sm:justify-end items-start gap-md md:gap-lg">
				{#each navGroups as group, i (group.label)}
					<div
						role="group"
						aria-labelledby="footer-group-{i}"
						class="flex flex-col items-start gap-xs"
					>
						<span
							id="footer-group-{i}"
							class="text-xs font-semibold uppercase tracking-wider text-taxi-yellow/70"
						>
							{group.label}
						</span>
						{#each group.items as item (item.href)}
							<a
								data-active={item.href === page.url.pathname}
								href={item.href}
								class="text-taxi-yellow hover:text-taxi-yellow/80 transition-colors data-[active=true]:font-semibold"
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</nav>

		<nav
			class="col-span-2 grid grid-cols-subgrid pt-sm border-t border-taxi-yellow/30 text-sm"
			aria-label="Rechtliches"
		>
			<div class="col-start-2 flex flex-col sm:flex-row flex-wrap sm:justify-end gap-sm md:gap-md">
				{#each legalItems as item (item.href)}
					<a
						data-active={item.href === page.url.pathname}
						href={item.href}
						class="text-taxi-yellow/90 hover:text-taxi-yellow transition-colors data-[active=true]:font-semibold"
					>
						{item.label}
					</a>
				{/each}
			</div>
		</nav>
	</div>
</footer>
