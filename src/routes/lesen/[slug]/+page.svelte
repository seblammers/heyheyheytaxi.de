<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import { page } from '$app/state';
	import { getPost } from '../data.remote';

	const slug = $derived(page.params.slug);
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

			<PostCard {post} showFullContent={true} />

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
</svelte:boundary>
