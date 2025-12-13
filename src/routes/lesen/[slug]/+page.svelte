<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import { page } from '$app/state';
	import { getPost } from '../data.remote';
	import { getToken, tokens } from '$lib/utils/tokenStorage';
	import DeleteStoryDialog from '$lib/components/DeleteStoryDialog.svelte';
	import { Button } from 'bits-ui';

	const slug = $derived(page.params.slug);
	const token = $derived.by(() => (slug ? getToken(slug) : null));
	const hasToken = $derived(!!token);
	let deleteDialogOpen = $state(false);

	// Debug: Log token availability
	$effect(() => {
		if (slug) {
			const foundToken = getToken(slug);
			console.log('[PostPage] Token check:', {
				slug,
				hasToken: !!foundToken,
				tokenLength: foundToken?.length
			});
		}
	});
</script>

<svelte:boundary>
	{#snippet pending()}
		<section class="nk-section">
			<div class="nk-container">
				<div class="flex justify-center py-xl">
					<p class="text-foreground-alt">Lade Geschichte...</p>
				</div>
			</div>
		</section>
	{/snippet}

	{#snippet failed(error)}
		<section class="nk-section">
			<div class="nk-container">
				<div class="nk-card text-center">
					<h1 class="mb-sm">Geschichte nicht gefunden</h1>
					<p class="text-foreground-alt mb-md">
						Diese Geschichte existiert nicht oder wurde noch nicht freigegeben.
					</p>
					<a href="/lesen" class="text-taxi-blue hover:underline font-medium">
						← Zurück zu allen Geschichten
					</a>
				</div>
			</div>
		</section>
	{/snippet}

	{@const post = await getPost(slug || '')}

	<section class="nk-section">
		<div class="nk-container max-w-prose">
			<nav class="mb-md">
				<a href="/lesen" class="text-taxi-blue hover:underline text-sm"> ← Alle Geschichten </a>
			</nav>

			{#if post.status === 'approved'}
				<PostCard {post} showFullContent={true} />
			{:else if post.status === 'pending'}
				<div class="nk-card text-center">
					<h1 class="mb-sm">Geschichte wird geprüft</h1>
					<p class="text-foreground-alt mb-md">
						Deine Geschichte befindet sich derzeit in der Prüfung. Sie wird nach der Freigabe hier
						veröffentlicht.
					</p>
					<div class="flex flex-col gap-sm">
						<p class="text-sm font-bold">Titel:</p>
						<p class="text-sm">{post.title}</p>
					</div>
				</div>
			{:else if post.status === 'rejected'}
				<div class="nk-card text-center">
					<h1 class="mb-sm">Geschichte wurde abgelehnt</h1>
					<p class="text-foreground-alt mb-md">
						Deine Geschichte wurde leider nicht veröffentlicht. Dies kann verschiedene Gründe haben,
						bitte informiere dich über unsere Regeln: <a
							href="/regeln"
							class="text-taxi-blue hover:underline">hier</a
						>.
					</p>
					<div class="flex flex-col gap-sm">
						<p class="text-sm font-bold">Titel:</p>
						<p class="text-sm">{post.title}</p>
					</div>
				</div>
			{/if}

			{#if hasToken && token}
				<div class="mt-md flex flex-col gap-sm">
					<div class="flex gap-sm">
						<a
							href="/lesen/{slug}/bearbeiten?token={token}"
							class="flex-1 px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity text-center"
						>
							Geschichte bearbeiten
						</a>
						<Button.Root
							onclick={() => {
								console.log('[PostPage] Opening delete dialog with:', {
									slug,
									token: token.substring(0, 10) + '...'
								});
								deleteDialogOpen = true;
							}}
							class="flex-1 px-md py-sm bg-destructive text-destructive-foreground font-bold rounded-button hover:opacity-90 transition-opacity"
						>
							Geschichte löschen
						</Button.Root>
					</div>
					<p class="text-xs text-foreground-alt text-center">
						Du kannst diese Geschichte bearbeiten oder löschen, da du den Bearbeitungstoken hast.
					</p>
				</div>
			{:else}
				<div class="mt-md p-sm bg-background-alt rounded-card text-center">
					<p class="text-sm text-foreground-alt mb-sm">
						Um diese Geschichte zu bearbeiten oder zu löschen, benötigst du den Bearbeitungstoken.
					</p>
					<a
						href="/lesen/{slug}/bearbeiten"
						class="text-taxi-blue hover:underline font-medium text-sm"
					>
						Token eingeben →
					</a>
				</div>
			{/if}

			<div class="mt-xl text-center">
				<a
					href="/einreichen"
					class="inline-block px-lg py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity"
				>
					Deine eigene Geschichte einreichen
				</a>
			</div>
		</div>
	</section>

	{#if hasToken && token && slug}
		<DeleteStoryDialog {slug} {token} bind:open={deleteDialogOpen} />
	{/if}
</svelte:boundary>
