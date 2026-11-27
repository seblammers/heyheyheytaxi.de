<script lang="ts">
	import { resolve } from '$app/paths';
	import Meta from '#lib/components/Meta.svelte';
	import PostEditForm from '#lib/components/PostEditForm.svelte';
	import DeleteStoryDialog from '#lib/components/DeleteStoryDialog.svelte';
	import { page } from '$app/state';
	import { getPost, validateEditToken } from '../../data.remote';
	import { getToken, saveToken, removeToken } from '#lib/utils/tokenStorage.ts';
	import { goto } from '$app/navigation';
	import { Button } from 'bits-ui';
	import type { PublicPost } from '#lib/server/db/schema.ts';

	const slug = $derived(page.params.slug ?? '');
	// Token comes from localStorage only – never from the URL (history, logs)
	const token = $derived(slug ? getToken(slug) : null);

	let tokenInput = $state('');
	let tokenError = $state<string | null>(null);
	let isSubmittingToken = $state(false);
	let tokenValidationResult = $state<{
		valid: boolean;
		reason?: string;
		post?: PublicPost;
	} | null>(null);
	let isValidatingToken = $state(false);
	let deleteDialogOpen = $state(false);
	let saved = $state(false);

	// Validate token when page loads with a token
	$effect(() => {
		const currentSlug = slug;
		const currentToken = token;

		if (currentSlug && currentToken) {
			isValidatingToken = true;
			tokenValidationResult = null;

			(async () => {
				try {
					const result = await validateEditToken({ slug: currentSlug, token: currentToken });
					tokenValidationResult = result;

					// If token is invalid, remove it from localStorage
					if (!result.valid && currentSlug) {
						removeToken(currentSlug);
					}
				} catch (error) {
					console.error('[EditPage] Token validation error:', error);
					tokenValidationResult = {
						valid: false,
						reason: 'Der Geheimcode konnte nicht geprüft werden'
					};
				} finally {
					isValidatingToken = false;
				}
			})();
		} else {
			tokenValidationResult = null;
		}
	});

	async function handleTokenSubmit(e: SubmitEvent) {
		e.preventDefault();
		tokenError = null;
		isSubmittingToken = true;

		const enteredToken = tokenInput.trim();

		if (!enteredToken) {
			tokenError = 'Bitte gib deinen Geheimcode ein.';
			isSubmittingToken = false;
			return;
		}

		if (!slug) {
			tokenError = 'Ungültige Geschichte.';
			isSubmittingToken = false;
			return;
		}

		// Validate token before saving
		try {
			const validation = await validateEditToken({ slug, token: enteredToken });

			if (!validation.valid) {
				tokenError = validation.reason || 'Dieser Geheimcode passt nicht';
				isSubmittingToken = false;
				return;
			}

			// Token is valid, save it to localStorage
			saveToken(slug, enteredToken);

			// Reload the page to pick up the token
			await goto(resolve('/lesen/[slug]/bearbeiten', { slug }), { refreshAll: true });
		} catch (error) {
			console.error('[EditPage] Token validation error:', error);
			tokenError = 'Der Geheimcode konnte nicht geprüft werden';
			isSubmittingToken = false;
		}
	}
</script>

<Meta title="Geschichte bearbeiten" noindex />

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
					<a href={resolve('/lesen')} class="text-taxi-blue hover:underline font-medium">
						← Zurück zu allen Geschichten
					</a>
				</div>
			</div>
		</section>
	{/snippet}

	<!-- Loaded for the 404 handling only; the editable content comes from validateEditToken -->
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{@const _post = await getPost(slug || '')}

	{#if !token || isValidatingToken || (token && tokenValidationResult === null)}
		<section class="nk-section">
			<div class="nk-container max-w-prose">
				<nav class="mb-md">
					<a
						href={resolve('/lesen/[slug]', { slug })}
						class="text-taxi-blue hover:underline text-sm"
					>
						← Zurück zur Geschichte
					</a>
				</nav>

				<div class="nk-card">
					{#if isValidatingToken}
						<div class="text-center py-xl">
							<p class="text-foreground-alt">Geheimcode wird geprüft...</p>
						</div>
					{:else}
						<header class="flex flex-col gap-sm mb-xl">
							<h1 class="mb-sm">Geheimcode eingeben</h1>
							<p class="text-foreground-alt">
								Um diese Geschichte zu bearbeiten, brauchst du den Geheimcode, den du beim
								Einreichen bekommen hast.
								<a href={resolve('/so-gehts#geheimcode')}>Was ist das?</a>
							</p>
						</header>

						<form onsubmit={handleTokenSubmit} class="flex flex-col gap-md">
							<div class="flex flex-col gap-2xs">
								<label for="token" class="font-bold">Geheimcode *</label>
								<input
									type="text"
									id="token"
									bind:value={tokenInput}
									placeholder="Gib deinen Geheimcode ein..."
									disabled={isSubmittingToken}
									class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								{#if tokenError}
									<p class="text-destructive text-sm">{tokenError}</p>
								{/if}
								<p class="text-xs text-foreground-alt">
									Der Geheimcode wurde dir direkt nach dem Einreichen angezeigt. Verloren?
									<a href={resolve('/so-gehts#email')}>So helfen wir dir</a>.
								</p>
							</div>

							<div class="flex flex-col gap-xs pt-sm">
								<Button.Root
									type="submit"
									disabled={isSubmittingToken}
									class="w-full px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{#if isSubmittingToken}
										Wird überprüft...
									{:else}
										Weiter
									{/if}
								</Button.Root>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</section>
	{:else if tokenValidationResult && !tokenValidationResult.valid}
		<section class="nk-section">
			<div class="nk-container max-w-prose">
				<nav class="mb-md">
					<a
						href={resolve('/lesen/[slug]', { slug })}
						class="text-taxi-blue hover:underline text-sm"
					>
						← Zurück zur Geschichte
					</a>
				</nav>

				<div class="nk-card text-center">
					<h1 class="mb-sm">Geheimcode passt nicht</h1>
					<p class="text-foreground-alt mb-md">
						{tokenValidationResult.reason || 'Dieser Geheimcode passt nicht zu dieser Geschichte.'}
					</p>
					<p class="text-sm text-foreground-alt mb-md">
						Der gespeicherte Code wurde entfernt. Bitte gib den richtigen Geheimcode für diese
						Geschichte ein.
					</p>
					<a
						href={resolve('/lesen/[slug]/bearbeiten', { slug })}
						class="inline-block px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity"
					>
						Geheimcode erneut eingeben
					</a>
				</div>
			</div>
		</section>
	{:else if tokenValidationResult?.valid && tokenValidationResult.post}
		<section class="nk-section">
			<div class="nk-container max-w-prose">
				<nav class="mb-md">
					<a
						href={resolve('/lesen/[slug]', { slug })}
						class="text-taxi-blue hover:underline text-sm"
					>
						← Zurück zur Geschichte
					</a>
				</nav>

				{#if !saved}
					<header class="flex flex-col gap-sm mb-xl">
						<h1>Geschichte bearbeiten</h1>
						<p class="text-foreground-alt">Bearbeite Titel und Inhalt deiner Geschichte.</p>
					</header>
				{/if}

				<div class="nk-card">
					<PostEditForm post={tokenValidationResult.post} {token} bind:saved />
				</div>

				{#if !saved}
					<div class="mt-md flex flex-col gap-xs">
						<Button.Root
							onclick={() => (deleteDialogOpen = true)}
							class="w-full px-md py-sm bg-destructive text-destructive-foreground font-bold rounded-button hover:opacity-90 transition-opacity"
						>
							Geschichte löschen
						</Button.Root>
					</div>
				{/if}
			</div>
		</section>

		{#if token && slug}
			<DeleteStoryDialog {slug} {token} bind:open={deleteDialogOpen} />
		{/if}
	{/if}
</svelte:boundary>
