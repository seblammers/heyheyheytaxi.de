<script lang="ts">
	import { Dialog, Button } from 'bits-ui';

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button.Root class="px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button">
			Test Dialog öffnen
		</Button.Root>
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
		<Dialog.Content
			class="nk-card w-full max-w-[95%] md:max-w-prose fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
		>
			<Dialog.Title class="text-xl font-bold mb-sm">Test Dialog</Dialog.Title>
			<Dialog.Description class="text-foreground-alt mb-md">
				Dies ist ein Test-Dialog, um die Dialog-Funktionalität zu testen.
			</Dialog.Description>

			<div class="flex flex-col gap-sm">
				<Button.Root
					onclick={() => (open = false)}
					class="w-full px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity"
				>
					Schließen
				</Button.Root>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
