<script lang="ts">
	import { Dialog, Button } from 'bits-ui';
	import { deletePost } from '../../routes/lesen/data.remote';
	import { removeToken } from '$lib/utils/tokenStorage';
	import { goto } from '$app/navigation';

	let {
		slug,
		token,
		open = $bindable(false)
	}: {
		slug: string;
		token: string;
		open?: boolean;
	} = $props();

	// Set form values when dialog opens or props change
	$effect(() => {
		if (slug && token) {
			deletePost.fields.slug.set(slug);
			deletePost.fields.token.set(token);
		}
	});

	// Handle successful deletion
	$effect(() => {
		if (deletePost.result?.success) {
			console.log('[DeleteStoryDialog] Delete successful, redirecting...');
			// Remove token from localStorage
			removeToken(slug);
			// Close dialog
			open = false;
			// Redirect to story list with success message
			goto('/lesen?deleted=true');
		}
	});

	// Check for form field errors
	$effect(() => {
		if (deletePost.fields) {
			const allIssues = deletePost.fields.allIssues();
			if (allIssues && allIssues.length > 0) {
				console.error('[DeleteStoryDialog] Form validation errors:', allIssues);
			}
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class="hidden" />
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
		<Dialog.Content
			class="nk-card w-full max-w-[95%] md:max-w-prose fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
		>
			<Dialog.Title class="text-xl font-bold mb-sm">Geschichte löschen?</Dialog.Title>
			<Dialog.Description class="text-foreground-alt mb-md">
				Bist du sicher, dass du diese Geschichte löschen möchtest? Diese Aktion kann nicht
				rückgängig gemacht werden.
			</Dialog.Description>

			<form {...deletePost}>
				<input {...deletePost.fields.slug.as('text')} type="hidden" value={slug} />
				<input {...deletePost.fields.token.as('text')} type="hidden" value={token} />

				<div class="flex flex-col gap-sm">
					<Button.Root
						type="submit"
						disabled={!!deletePost.pending}
						class="w-full px-md py-sm bg-destructive text-destructive-foreground font-bold rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if deletePost.pending}
							Wird gelöscht...
						{:else}
							Ja, löschen
						{/if}
					</Button.Root>

					<Button.Root
						type="button"
						onclick={() => (open = false)}
						disabled={!!deletePost.pending}
						class="w-full px-md py-sm bg-background border border-border-input font-medium rounded-button hover:bg-background-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Abbrechen
					</Button.Root>
				</div>
			</form>

			{#if deletePost?.fields}
				{@const allIssues = deletePost.fields.allIssues()}
				{#if allIssues && allIssues.length > 0}
					<div class="mt-sm p-sm bg-destructive/10 text-destructive rounded-card text-sm">
						<p class="font-bold mb-xs">Fehler:</p>
						<ul class="list-disc list-inside">
							{#each allIssues as issue}
								<li>{issue.message}</li>
							{/each}
						</ul>
					</div>
				{/if}
			{/if}

			{#if deletePost.result && !deletePost.result.success}
				<div class="mt-sm p-sm bg-destructive/10 text-destructive rounded-card text-sm">
					<p>Fehler beim Löschen der Geschichte. Bitte versuche es erneut.</p>
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
