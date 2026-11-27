<script lang="ts">
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import { Button } from 'bits-ui';
	import SimpleEditor from './SimpleEditor.svelte';
	import FormIssuesHint from './FormIssuesHint.svelte';
	import StoryLinkBox from './StoryLinkBox.svelte';
	import EditTokenBox from './EditTokenBox.svelte';
	import { updatePost } from '../../routes/lesen/data.remote';
	import type { PublicPost } from '#lib/server/db/schema.ts';

	let {
		post,
		token,
		saved = $bindable(false)
	}: {
		post: PublicPost;
		token: string;
		saved?: boolean;
	} = $props();

	// Local flag instead of updatePost.result: the remote form is a module-level singleton,
	// so its result would survive navigation and hide the editor on the next visit.
	const enhancedForm = updatePost.enhance(async ({ submit }) => {
		saved = await submit();
	});

	let editorContent = $state(post.content);
	let contentTextarea = $state<HTMLTextAreaElement>();

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
		// fields.set() reads the current form input internally. Untracked, otherwise every
		// edit re-runs this effect and resets title/content to the original post.
		untrack(() => {
			updatePost.fields.slug.set(currentPost.slug);
			updatePost.fields.token.set(currentToken);
			updatePost.fields.title.set(currentPost.title);
			updatePost.fields.content.set(currentPost.content);
			editorContent = currentPost.content;
		});
	});
</script>

{#if saved}
	<div class="p-md bg-accent text-accent-foreground rounded-card">
		<p class="font-bold mb-sm">Änderungen gespeichert!</p>
		<p class="text-sm mb-md">
			Deine Geschichte wurde aktualisiert. Wir prüfen sie noch einmal, ob sie <a
				href={resolve('/regeln')}
				target="_blank"
			>
				unseren Regeln
			</a> entspricht, und veröffentlichen sie dann erneut.
		</p>

		<StoryLinkBox slug={post.slug} />

		<div class="mt-md">
			<EditTokenBox slug={post.slug} {token} alreadySaved />
		</div>
	</div>
{:else}
	<form {...enhancedForm} class="flex flex-col gap-md">
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
				class="sr-only"></textarea>
			{#each updatePost.fields.content.issues() as issue}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}
		</div>

		<div class="flex flex-col gap-xs pt-sm">
			<FormIssuesHint count={updatePost.fields.allIssues()?.length ?? 0} />

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
	</form>
{/if}
