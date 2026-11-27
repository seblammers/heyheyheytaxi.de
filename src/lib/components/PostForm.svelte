<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from 'bits-ui';
	import SimpleEditor from './SimpleEditor.svelte';
	import MorphCheckbox from './MorphCheckbox.svelte';
	import FormIssuesHint from './FormIssuesHint.svelte';
	import StoryLinkBox from './StoryLinkBox.svelte';
	import EditTokenBox from './EditTokenBox.svelte';
	import { submitPost } from '../../routes/lesen/data.remote';

	let editorContent = $state('');
	let contentTextarea = $state<HTMLTextAreaElement>();
	let editToken = $state<string | null>(null);

	let showAnotherForm = $state(false);

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

	function handleSubmitAnother() {
		// Reset form state by reloading the page
		window.location.reload();
	}
</script>

<form {...submitPost} class="flex flex-col gap-md">
	{#if submitPost.result?.success && !showAnotherForm}
		<div class="p-md bg-accent text-accent-foreground rounded-card">
			<p class="font-bold mb-sm">Danke für deine Geschichte!</p>
			<p class="text-sm mb-md">
				Sie wird bald veröffentlicht. Wir prüfen, ob deine Geschichte <a
					href={resolve('/regeln')}
					target="_blank"
				>
					unseren Regeln
				</a> entspricht.
			</p>

			{#if submitPost.result?.slug}
				<StoryLinkBox slug={submitPost.result.slug} />
			{/if}

			{#if editToken && submitPost.result?.slug}
				<div class="mt-md">
					<EditTokenBox slug={submitPost.result.slug} token={editToken} />
				</div>
			{/if}

			<button
				type="button"
				onclick={handleSubmitAnother}
				class="nk-button nk-button-secondary w-full mt-md"
			>
				Noch eine Geschichte einreichen
			</button>
		</div>
	{:else}
		<div class="flex flex-col gap-2xs">
			<label for="title" class="font-bold">Titel *</label>
			<input
				{...submitPost.fields.title.as('text')}
				id="title"
				placeholder="Gib deiner Geschichte einen Titel..."
				class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors"
			/>
			{#each submitPost.fields.title.issues() as issue (issue.message)}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}
		</div>

		<div class="flex flex-col gap-2xs">
			<label for="content" class="font-bold">Deine Geschichte *</label>
			<SimpleEditor
				content={editorContent}
				onUpdate={handleEditorUpdate}
				class="rounded-input overflow-hidden"
			/>
			<!-- Hidden textarea for form submission -->
			<textarea
				{...submitPost.fields.content.as('text')}
				bind:this={contentTextarea}
				id="content"
				class="sr-only"></textarea>
			{#each submitPost.fields.content.issues() as issue (issue.message)}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}
		</div>

		<div class="flex flex-col gap-2xs">
			<label for="authorName" class="font-bold">Dein Name *</label>
			<input
				{...submitPost.fields.authorName.as('text')}
				id="authorName"
				placeholder="z. B. Mia, Papa Ben oder Taxifahrerin Tilda"
				aria-describedby="authorName-hint"
				class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors"
			/>
			<p id="authorName-hint" class="text-xs text-foreground-alt">
				Unter diesem Namen wird deine Geschichte veröffentlicht. Ein Pseudonym oder Spitzname ist
				völlig in Ordnung.
			</p>
			{#each submitPost.fields.authorName.issues() as issue (issue.message)}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}
		</div>

		<div class="flex flex-col gap-2xs">
			<label for="authorEmail" class="font-bold">Deine E-Mail (optional)</label>
			<input
				{...submitPost.fields.authorEmail.as('email')}
				id="authorEmail"
				type="email"
				placeholder="deine@email.de"
				aria-describedby="authorEmail-hint"
				class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors"
			/>
			<p id="authorEmail-hint" class="text-xs text-foreground-alt">
				Freiwillig. Nach dem Einreichen zeigt dir diese Internetseite einen <a
					href={resolve('/so-gehts#geheimcode')}
					target="_blank"
				>
					Geheimcode
				</a>
				an, mit dem du deine Geschichte später ändern kannst. Mit deiner E-Mail können wir dir helfen,
				falls du den Code verlierst. Wir schicken dir nie Werbung.
				<a href={resolve('/so-gehts#email')} target="_blank"> Wie das genau funktioniert → </a>
			</p>
			{#each submitPost.fields.authorEmail.issues() as issue (issue.message)}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}
		</div>

		<!-- Honeypot against spam bots: visually hidden, skipped by keyboard and screen readers -->
		<div class="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
			<label for="website">Website</label>
			<input
				{...submitPost.fields.website.as('text')}
				id="website"
				tabindex="-1"
				autocomplete="off"
			/>
		</div>

		<div class="flex flex-col gap-xs pt-sm">
			<label class="flex gap-xs items-start cursor-pointer nk-inset text-sm text-foreground-alt">
				<MorphCheckbox {...submitPost.fields.rulesAccepted.as('checkbox')} required />
				<span>
					Ich habe die
					<a
						href={resolve('/regeln')}
						target="_blank"
						class="text-taxi-blue hover:underline font-medium"
					>
						Regeln
					</a>
					gelesen und halte mich daran.
				</span>
			</label>
			{#each submitPost.fields.rulesAccepted.issues() as issue (issue.message)}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}

			<label class="flex gap-xs items-start cursor-pointer nk-inset text-sm text-foreground-alt">
				<MorphCheckbox {...submitPost.fields.licenseAccepted.as('checkbox')} required />
				<span>
					Ich bestätige, dass ich das Urheberrecht an dieser Geschichte besitze und sie unter der
					<a
						href={resolve('/regeln#lizenz')}
						target="_blank"
						class="text-taxi-blue hover:underline font-medium"
					>
						CC BY-SA 4.0 Lizenz
					</a>
					veröffentlichen möchte – mit dem oben angegebenen Namen als Urhebernennung. Ich räume der Plattform
					das Recht ein, die Geschichte auch auf Social Media zu teilen.
				</span>
			</label>
			{#each submitPost.fields.licenseAccepted.issues() as issue (issue.message)}
				<p class="text-destructive text-sm">{issue.message}</p>
			{/each}

			<FormIssuesHint count={submitPost.fields.allIssues()?.length ?? 0} />

			<Button.Root
				type="submit"
				disabled={!!submitPost.pending}
				class="nk-button nk-button-primary w-full"
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
	{/if}
</form>
