<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import { getApprovedPosts } from './data.remote';
</script>

<svelte:head>
	<title>Alle Geschichten | Hey, hey, hey, Taxi!</title>
	<meta name="description" content="Alle Taxi-Geschichten unserer Community." />
</svelte:head>

<section class="nk-section">
	<div class="nk-container">
		<header class="flex flex-col gap-sm mb-xl">
			<h1>Taxi-Geschichten</h1>
			<p class="text-foreground-alt">Hier findest du alle Geschichten aus unserer Community.</p>
		</header>

		<svelte:boundary>
			{#snippet pending()}
				<div class="flex justify-center py-xl">
					<p class="text-foreground-alt">Lade Geschichten...</p>
				</div>
			{/snippet}

			{#snippet failed(error)}
				<div class="nk-card bg-destructive/10 text-destructive">
					<p>Fehler beim Laden der Geschichten. Bitte versuche es später erneut.</p>
				</div>
			{/snippet}

			{@const posts = await getApprovedPosts()}
			{#if posts.length === 0}
				<div class="nk-card text-center">
					<p class="text-foreground-alt">Noch keine Geschichten vorhanden.</p>
					<a href="/einreichen" class="text-taxi-blue hover:underline font-medium">
						Sei der Erste und teile deine Geschichte!
					</a>
				</div>
			{:else}
				<div class="flex flex-col gap-md">
					{#each posts as post (post.id)}
						<PostCard {post} />
					{/each}
				</div>
			{/if}
		</svelte:boundary>

		<div class="mt-xl text-center">
			<a
				href="/einreichen"
				class="inline-block px-lg py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity"
			>
				Deine Geschichte einreichen
			</a>
		</div>
	</div>
</section>
