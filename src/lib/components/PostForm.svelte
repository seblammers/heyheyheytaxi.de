<script lang="ts">
	import { Button } from 'bits-ui';
	import SimpleEditor from './SimpleEditor.svelte';
	import { submitPost } from '../../routes/lesen/data.remote';
	import { saveToken } from '$lib/utils/tokenStorage';

	let editorContent = $state('');
	let contentTextarea: HTMLTextAreaElement;
	let editToken = $state<string | null>(null);
	let tokenCopied = $state(false);

	function handleEditorUpdate(html: string) {
		editorContent = html;
		// Update both the form field and textarea
		submitPost.fields.content.set(html);
		if (contentTextarea) {
			contentTextarea.value = html;
		}
	}

	// Sync textarea value when editorContent changes
	$effect(() => {
		if (contentTextarea && editorContent) {
			contentTextarea.value = editorContent;
		}
	});

	// Handle successful submission
	$effect(() => {
		if (submitPost.result?.success && submitPost.result?.editToken) {
			editToken = submitPost.result.editToken;
		}
	});

	function handleSaveToken(slug: string, token: string) {
		saveToken(slug, token);
		alert(
			'Token wurde im Browser gespeichert! Du kannst deine Geschichte jetzt jederzeit bearbeiten.'
		);
	}

	function handleCopyToken(token: string) {
		navigator.clipboard.writeText(token).then(() => {
			tokenCopied = true;
			setTimeout(() => {
				tokenCopied = false;
			}, 2000);
		});
	}
</script>

<form {...submitPost} class="flex flex-col gap-md">
	<div class="flex flex-col gap-2xs">
		<label for="title" class="font-bold">Titel *</label>
		<input
			{...submitPost.fields.title.as('text')}
			id="title"
			placeholder="Gib deiner Geschichte einen Titel..."
			class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors"
		/>
		{#each submitPost.fields.title.issues() as issue}
			<p class="text-destructive text-sm">{issue.message}</p>
		{/each}
	</div>

	<div class="flex flex-col gap-2xs">
		<label for="content" class="font-bold">Deine Geschichte *</label>
		<SimpleEditor content="" onUpdate={handleEditorUpdate} class="rounded-input overflow-hidden" />
		<!-- Hidden textarea for form submission -->
		<textarea
			{...submitPost.fields.content.as('text')}
			bind:this={contentTextarea}
			id="content"
			class="sr-only"
		></textarea>
		{#each submitPost.fields.content.issues() as issue}
			<p class="text-destructive text-sm">{issue.message}</p>
		{/each}
	</div>

	<div class="flex flex-col gap-2xs">
		<label for="authorName" class="font-bold">Dein Name (optional)</label>
		<input
			{...submitPost.fields.authorName.as('text')}
			id="authorName"
			placeholder="Anonym"
			class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors"
		/>
		{#each submitPost.fields.authorName.issues() as issue}
			<p class="text-destructive text-sm">{issue.message}</p>
		{/each}
	</div>

	<div class="flex flex-col gap-xs pt-sm">
		<Button.Root
			type="submit"
			disabled={!!submitPost.pending}
			class="w-full px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if submitPost.pending}
				Wird eingereicht...
			{:else}
				Geschichte einreichen
			{/if}
		</Button.Root>

		<p class="text-sm text-foreground-alt text-center">
			Deine Geschichte wird nach einer kurzen Prüfung veröffentlicht.
		</p>
	</div>

	{#if submitPost.result?.success}
		<div class="p-md bg-accent text-accent-foreground rounded-card">
			<p class="font-bold mb-sm">Danke für deine Geschichte!</p>
			<p class="text-sm mb-md">Sie wird bald veröffentlicht.</p>

			<div class="mb-md p-sm bg-background rounded-card border border-border">
				<p class="text-xs text-foreground-alt mb-xs">
					💡 <strong>Tipp:</strong> Du kannst den Status deiner Geschichte jederzeit unter{' '}
					<a href="/lesen/status" class="text-taxi-blue hover:underline font-medium">
						Status prüfen
					</a>{' '}
					überprüfen.
				</p>
			</div>

			{#if editToken && submitPost.result?.slug}
				<div class="mt-md p-sm bg-background rounded-card border border-border">
					<p class="font-bold mb-xs text-sm">📝 Bearbeitungstoken:</p>
					<div class="flex items-center gap-xs mb-sm">
						<code class="flex-1 px-sm py-xs bg-background-alt rounded text-sm font-mono break-all">
							{editToken}
						</code>
						<button
							type="button"
							onclick={() => handleCopyToken(editToken!)}
							class="px-sm py-xs bg-taxi-blue text-taxi-yellow rounded-button text-sm font-medium hover:opacity-90 transition-opacity"
						>
							{tokenCopied ? '✓ Kopiert' : 'Kopieren'}
						</button>
					</div>
					<p class="text-xs text-foreground-alt mb-sm">
						⚠️ WICHTIG: Speichere diesen Token sicher! Mit diesem Token kannst du deine Geschichte
						später bearbeiten oder löschen.
					</p>
					<button
						type="button"
						onclick={() => handleSaveToken(submitPost.result!.slug, editToken!)}
						class="w-full px-sm py-xs bg-taxi-blue text-taxi-yellow rounded-button text-sm font-medium hover:opacity-90 transition-opacity"
					>
						In Browser speichern
					</button>
				</div>
			{/if}
		</div>
	{/if}

	{#if submitPost?.fields}
		{@const allIssues = submitPost.fields.allIssues()}
		{#if allIssues && allIssues.length > 0}
			<div class="p-sm bg-destructive/10 text-destructive rounded-card">
				<p class="font-bold mb-xs">Bitte korrigiere folgende Fehler:</p>
				<ul class="list-disc list-inside text-sm">
					{#each allIssues as issue}
						<li>{issue.message}</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</form>
