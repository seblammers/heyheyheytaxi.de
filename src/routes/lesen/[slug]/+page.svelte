<script lang="ts">
	import Meta from '#lib/components/Meta.svelte';
	import { storyDescription } from '#lib/seo.ts';
	import PostCard from '#lib/components/PostCard.svelte';
	import { page } from '$app/state';
	import { getPost } from '../data.remote';

	const slug = $derived(page.params.slug);
</script>

<svelte:head>
	<!-- Machine-readable license for the story on this page -->
	<link rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/" />
</svelte:head>

<svelte:boundary>
	<!-- No pending snippet on purpose: with one, SSR only renders the pending state,
	     so the story (and its title/meta) would be missing from the server HTML. -->
	{#snippet failed(error)}
		<Meta title="Geschichte nicht gefunden" noindex />
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

	<!-- Inside the boundary so the title comes from the awaited post (also during SSR).
	     Pending or rejected stories must not end up in search results. -->
	<Meta
		title={post.title}
		description={storyDescription}
		image={post.status === 'approved' ? `/og/lesen/${post.slug}.png` : undefined}
		noindex={post.status !== 'approved'}
	/>

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
						bitte informiere dich über unsere Regeln: <a href="/regeln">hier</a>.
					</p>
					<div class="flex flex-col gap-sm">
						<p class="text-sm font-bold">Titel:</p>
						<p class="text-sm">{post.title}</p>
					</div>
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
</svelte:boundary>
