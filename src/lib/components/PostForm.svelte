<script lang="ts">
	import { Button } from 'bits-ui';
	import SimpleEditor from './SimpleEditor.svelte';
	import { submitPost } from '../../routes/lesen/data.remote';

	let editorContent = $state('');
	let contentTextarea: HTMLTextAreaElement;

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
		<div class="p-sm bg-accent text-accent-foreground rounded-card text-center">
			<p class="font-bold">Danke für deine Geschichte!</p>
			<p class="text-sm">Sie wird bald veröffentlicht.</p>
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
