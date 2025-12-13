<script lang="ts">
	import { Button } from 'bits-ui';
	import SimpleEditor from './SimpleEditor.svelte';
	import { updatePost } from '../../routes/lesen/data.remote';
	import type { Post } from '$lib/server/db/schema';

	let {
		post,
		token
	}: {
		post: Post;
		token: string;
	} = $props();

	let editorContent = $state(post.content);
	let contentTextarea: HTMLTextAreaElement;

	function handleEditorUpdate(html: string) {
		editorContent = html;
		// Update both the form field and textarea
		updatePost.fields.content.set(html);
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

	// Set initial values when component mounts or props change
	$effect(() => {
		const currentPost = post;
		const currentToken = token;
		updatePost.fields.slug.set(currentPost.slug);
		updatePost.fields.token.set(currentToken);
		updatePost.fields.title.set(currentPost.title);
		updatePost.fields.content.set(currentPost.content);
		editorContent = currentPost.content;
	});

	// Debug: Log form result changes
	$effect(() => {
		if (updatePost.result) {
			console.log('[PostEditForm] Form result:', updatePost.result);
		}
	});
</script>

<form {...updatePost} class="flex flex-col gap-md">
	<!-- Hidden fields for slug and token - must be set before form submission -->
	<input {...updatePost.fields.slug.as('text')} type="hidden" value={post.slug} />
	<input {...updatePost.fields.token.as('text')} type="hidden" value={token} />

	<div class="flex flex-col gap-2xs">
		<label for="title" class="font-bold">Titel *</label>
		<input
			{...updatePost.fields.title.as('text')}
			id="title"
			placeholder="Gib deiner Geschichte einen Titel..."
			class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors"
		/>
		{#each updatePost.fields.title.issues() as issue}
			<p class="text-destructive text-sm">{issue.message}</p>
		{/each}
	</div>

	<div class="flex flex-col gap-2xs">
		<label for="content" class="font-bold">Deine Geschichte *</label>
		<SimpleEditor
			content={post.content}
			onUpdate={handleEditorUpdate}
			class="rounded-input overflow-hidden"
		/>
		<!-- Hidden textarea for form submission -->
		<textarea
			{...updatePost.fields.content.as('text')}
			bind:this={contentTextarea}
			id="content"
			class="sr-only"
		></textarea>
		{#each updatePost.fields.content.issues() as issue}
			<p class="text-destructive text-sm">{issue.message}</p>
		{/each}
	</div>

	<div class="flex flex-col gap-xs pt-sm">
		<Button.Root
			type="submit"
			disabled={!!updatePost.pending}
			class="w-full px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if updatePost.pending}
				Wird gespeichert...
			{:else}
				Änderungen speichern
			{/if}
		</Button.Root>

		<p class="text-sm text-foreground-alt text-center">
			Deine Geschichte wird nach einer kurzen Prüfung erneut veröffentlicht.
		</p>
	</div>

	{#if updatePost.result?.success}
		<div class="p-sm bg-accent text-accent-foreground rounded-card text-center">
			<p class="font-bold">Änderungen gespeichert!</p>
			<p class="text-sm mb-sm">
				Die Geschichte wurde aktualisiert und wird erneut geprüft. Sie ist jetzt wieder im Status
				"pending" und wird nach der Prüfung erneut veröffentlicht.
			</p>
			<a href="/lesen" class="inline-block text-taxi-blue hover:underline font-medium">
				← Zurück zu allen Geschichten
			</a>
		</div>
	{/if}

	{#if updatePost.result && !updatePost.result.success}
		<div class="p-sm bg-destructive/10 text-destructive rounded-card text-center">
			<p class="font-bold">Fehler beim Speichern</p>
			<p class="text-sm">Die Änderungen konnten nicht gespeichert werden.</p>
		</div>
	{/if}

	{#if updatePost?.fields}
		{@const allIssues = updatePost.fields.allIssues()}
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
