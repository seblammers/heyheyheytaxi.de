<script lang="ts">
	import PostEditForm from '$lib/components/PostEditForm.svelte';
	import { page } from '$app/state';
	import { getPost } from '../../data.remote';
	import { getToken } from '$lib/utils/tokenStorage';
	import { goto } from '$app/navigation';

	const slug = $derived(page.params.slug);
	const tokenParam = $derived(page.url.searchParams.get('token'));

	// Get token from localStorage or URL param
	const token = $derived.by(() => {
		if (tokenParam) return tokenParam;
		if (slug) return getToken(slug);
		return null;
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

	{#snippet failed(error: unknown)}
		<section class="nk-section">
			<div class="nk-container">
				<div class="nk-card text-center">
					<h1 class="mb-sm">Fehler</h1>
					<p class="text-foreground-alt mb-md">
						Die Geschichte konnte nicht geladen werden:{' '}
						{error instanceof Error ? error.message : String(error) || 'Unbekannter Fehler'}
					</p>
					<a href="/lesen" class="text-taxi-blue hover:underline font-medium">
						← Zurück zu allen Geschichten
					</a>
				</div>
			</div>
		</section>
	{/snippet}

	{@const post = await getPost(slug || '')}

	{#if !token}
		<section class="nk-section">
			<div class="nk-container max-w-prose">
				<div class="nk-card text-center">
					<h1 class="mb-sm">Bearbeitungstoken erforderlich</h1>
					<p class="text-foreground-alt mb-md">
						Um diese Geschichte zu bearbeiten, benötigst du den Bearbeitungstoken, den du beim
						Einreichen erhalten hast.
					</p>
					<a href="/lesen/{slug}" class="text-taxi-blue hover:underline font-medium">
						← Zurück zur Geschichte
					</a>
				</div>
			</div>
		</section>
	{:else}
		<section class="nk-section">
			<div class="nk-container max-w-prose">
				<nav class="mb-md">
					<a href="/lesen/{slug}" class="text-taxi-blue hover:underline text-sm">
						← Zurück zur Geschichte
					</a>
				</nav>

				<header class="flex flex-col gap-sm mb-xl">
					<h1>Geschichte bearbeiten</h1>
					<p class="text-foreground-alt">Bearbeite Titel und Inhalt deiner Geschichte.</p>
				</header>

				<div class="nk-card">
					<PostEditForm {post} {token} />
				</div>
			</div>
		</section>
	{/if}
</svelte:boundary>
