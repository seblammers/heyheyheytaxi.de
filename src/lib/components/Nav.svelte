<script lang="ts">
	import TaxiLogo from './TaxiLogo.svelte';
	import { Menu, X } from 'lucide';
	import { MorphIcon } from 'morphicons/svelte';
	import { navGroups } from '#lib/config.ts';
	import { Popover, Button } from 'bits-ui';
	import { page } from '$app/state';

	let open = $state(false);
</script>

<nav class="flex items-center justify-between nk-container py-sm! w-full relative z-50">
	<a href="/" class="flex items-center">
		<TaxiLogo />
		<span class="sr-only">Startseite</span>
	</a>

	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button.Root
					{...props}
					class="p-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
				>
					<MorphIcon icon={open ? X : Menu} spring="snappy" size={48} />
					<span class="sr-only">Menü öffnen/schließen</span>
				</Button.Root>
			{/snippet}
		</Popover.Trigger>
		<Popover.Portal>
			{#if open}
				<div
					class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
					data-state={open ? 'open' : 'closed'}
					onclick={() => (open = false)}
					onkeydown={(e) => {
						if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
							open = false;
						}
					}}
					role="button"
					tabindex="-1"
					aria-label="Menü schließen"
				></div>
			{/if}
			<Popover.Content
				class="bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-popover-content-transform-origin) pr-0 rounded-button shadow-card z-50"
				align="end"
				side="bottom"
				alignOffset={4}
				sideOffset={4}
				preventScroll
				trapFocus={false}
			>
				<div class="flex flex-col py-xs divide-y divide-border-card">
					{#each navGroups as group, i (group.label)}
						<div role="group" aria-labelledby="nav-group-{i}" class="flex flex-col gap-0.5 py-xs">
							<span
								id="nav-group-{i}"
								class="px-3 text-xs font-semibold uppercase tracking-wider text-taxi-blue mb-1"
							>
								{group.label}
							</span>
							{#each group.items as item (item.href)}
								<a
									href={item.href}
									data-active={item.href === page.url.pathname}
									onclick={() => (open = false)}
									class="text-foreground/95 px-3 py-1 sm:py-0 text-[22px] font-normal data-[active=true]:font-semibold hover:bg-muted transition-colors"
								>
									{item.label}
								</a>
							{/each}
						</div>
					{/each}
				</div>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</nav>
