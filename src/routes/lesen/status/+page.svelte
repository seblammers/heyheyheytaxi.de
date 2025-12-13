<script lang="ts">
	import { Button } from 'bits-ui';
	import { checkStoryStatus } from '../data.remote';
	import { page } from '$app/state';

	const baseUrl = $derived(page.url.origin);
</script>

<svelte:head>
	<title>Geschichten-Status prüfen | Hey, hey, hey, Taxi!</title>
	<meta name="description" content="Prüfe den Status deiner eingereichten Geschichte." />
</svelte:head>

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-sm mb-xl text-center">
			<h1>Geschichten-Status prüfen</h1>
			<p class="text-foreground-alt">
				Gib deinen Bearbeitungstoken ein, um den Status deiner Geschichte zu überprüfen.
			</p>
		</header>

		<div class="nk-card">
			<form {...checkStoryStatus} class="flex flex-col gap-md">
				<div class="flex flex-col gap-2xs">
					<label for="token" class="font-bold">Bearbeitungstoken *</label>
					<input
						{...checkStoryStatus.fields.token.as('text')}
						id="token"
						placeholder="Gib deinen Bearbeitungstoken ein..."
						class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors font-mono text-sm"
					/>
					{#each checkStoryStatus.fields.token.issues() as issue}
						<p class="text-destructive text-sm">{issue.message}</p>
					{/each}
					<p class="text-xs text-foreground-alt">
						Du hast diesen Token beim Einreichen deiner Geschichte erhalten.
					</p>
				</div>

				<Button.Root
					type="submit"
					disabled={!!checkStoryStatus.pending}
					class="w-full px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if checkStoryStatus.pending}
						Status wird geprüft...
					{:else}
						Status prüfen
					{/if}
				</Button.Root>
			</form>

			{#if checkStoryStatus.result?.success && checkStoryStatus.result?.story}
				{@const story = checkStoryStatus.result.story}
				<div class="mt-md p-md bg-accent text-accent-foreground rounded-card">
					<h2 class="font-bold text-lg mb-sm">Status deiner Geschichte</h2>
					<div class="flex flex-col gap-sm">
						<div>
							<p class="font-bold mb-xs">Titel:</p>
							<p class="text-sm">{story.title}</p>
						</div>
						<div>
							<p class="font-bold mb-xs">Status:</p>
							{#if story.status === 'approved'}
								<p class="text-sm text-green-700 dark:text-green-400">
									✓ Genehmigt und veröffentlicht
								</p>
							{:else if story.status === 'pending'}
								<p class="text-sm text-yellow-700 dark:text-yellow-400">⏳ Wird geprüft</p>
							{:else if story.status === 'rejected'}
								<p class="text-sm text-red-700 dark:text-red-400">✗ Abgelehnt</p>
							{/if}
						</div>
						<div>
							<p class="font-bold mb-xs">Link zu deiner Geschichte:</p>
							<div class="flex items-center gap-xs">
								<input
									type="text"
									readonly
									value="{baseUrl}{story.url}"
									class="flex-1 px-sm py-xs bg-background border border-border-input rounded-input text-sm font-mono"
								/>
								<Button.Root
									type="button"
									onclick={() => {
										navigator.clipboard.writeText(`${baseUrl}${story.url}`);
										alert('Link kopiert!');
									}}
									class="px-sm py-xs bg-taxi-blue text-taxi-yellow rounded-button text-sm font-medium hover:opacity-90 transition-opacity"
								>
									Kopieren
								</Button.Root>
							</div>
						</div>
						<div class="mt-sm">
							<a
								href={story.url}
								class="inline-block w-full px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity text-center"
							>
								Zur Geschichte
							</a>
						</div>
					</div>
				</div>
			{/if}

			{#if checkStoryStatus.result && !checkStoryStatus.result.success}
				<div class="mt-md p-md bg-destructive/10 text-destructive rounded-card">
					<p class="font-bold mb-xs">Geschichte nicht gefunden</p>
					<p class="text-sm">
						{checkStoryStatus.result.error || 'Keine Geschichte mit diesem Token gefunden.'}
					</p>
					{#if checkStoryStatus.result.rateLimitRemaining !== undefined}
						<p class="text-xs mt-sm text-foreground-alt">
							Verbleibende Versuche: {checkStoryStatus.result.rateLimitRemaining}
						</p>
					{/if}
					<p class="text-xs mt-sm text-foreground-alt">
						Bitte überprüfe, ob du den Token korrekt eingegeben hast. Du hast diesen Token beim
						Einreichen deiner Geschichte erhalten.
					</p>
				</div>
			{/if}

			{#if checkStoryStatus?.fields}
				{@const allIssues = checkStoryStatus.fields.allIssues()}
				{#if allIssues && allIssues.length > 0}
					<div class="mt-md p-sm bg-destructive/10 text-destructive rounded-card">
						<p class="font-bold mb-xs">Bitte korrigiere folgende Fehler:</p>
						<ul class="list-disc list-inside text-sm">
							{#each allIssues as issue}
								<li>{issue.message}</li>
							{/each}
						</ul>
					</div>
				{/if}
			{/if}
		</div>

		<div class="mt-lg text-center">
			<a href="/lesen" class="text-taxi-blue hover:underline text-sm">
				← Zurück zu allen Geschichten
			</a>
		</div>
	</div>
</section>
