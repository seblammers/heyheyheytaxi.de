<script lang="ts">
	import PostEditForm from '$lib/components/PostEditForm.svelte';
	import { page } from '$app/state';
	import { getPost, validateEditToken } from '../../data.remote';
	import { getToken, saveToken, removeToken } from '$lib/utils/tokenStorage';
	import { goto } from '$app/navigation';
	import { Button } from 'bits-ui';

	const slug = $derived(page.params.slug);
	const tokenParam = $derived(page.url.searchParams.get('token'));

	// Get token from localStorage or URL param
	const token = $derived.by(() => {
		if (tokenParam) return tokenParam;
		if (slug) return getToken(slug);
		return null;
	});

	let tokenInput = $state('');
	let tokenError = $state<string | null>(null);
	let isSubmittingToken = $state(false);
	let tokenValidationResult = $state<{ valid: boolean; reason?: string } | null>(null);
	let isValidatingToken = $state(false);

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
					if (!result.valid && currentSlug && !tokenParam) {
						// Remove invalid token from localStorage if it wasn't from URL param
						removeToken(currentSlug);
					}
				} catch (error) {
					console.error('[EditPage] Token validation error:', error);
					tokenValidationResult = { valid: false, reason: 'Fehler bei der Token-Validierung' };
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
			tokenError = 'Bitte gib einen Token ein.';
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
				tokenError = validation.reason || 'Ungültiger Bearbeitungstoken';
				isSubmittingToken = false;
				return;
			}

			// Token is valid, save it to localStorage
			saveToken(slug, enteredToken);

			// Reload the page to pick up the token
			await goto(`/lesen/${slug}/bearbeiten`, { invalidateAll: true });
		} catch (error) {
			console.error('[EditPage] Token validation error:', error);
			tokenError = 'Fehler bei der Token-Validierung';
			isSubmittingToken = false;
		}
	}
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

	{#if !token || isValidatingToken || (token && tokenValidationResult === null)}
		<section class="nk-section">
			<div class="nk-container max-w-prose">
				<nav class="mb-md">
					<a href="/lesen/{slug}" class="text-taxi-blue hover:underline text-sm">
						← Zurück zur Geschichte
					</a>
				</nav>

				<div class="nk-card">
					{#if isValidatingToken}
						<div class="text-center py-xl">
							<p class="text-foreground-alt">Token wird überprüft...</p>
						</div>
					{:else}
						<header class="flex flex-col gap-sm mb-xl">
							<h1 class="mb-sm">Bearbeitungstoken erforderlich</h1>
							<p class="text-foreground-alt">
								Um diese Geschichte zu bearbeiten, benötigst du den Bearbeitungstoken, den du beim
								Einreichen erhalten hast.
							</p>
						</header>

						<form onsubmit={handleTokenSubmit} class="flex flex-col gap-md">
							<div class="flex flex-col gap-2xs">
								<label for="token" class="font-bold">Bearbeitungstoken *</label>
								<input
									type="text"
									id="token"
									bind:value={tokenInput}
									placeholder="Gib deinen Bearbeitungstoken ein..."
									disabled={isSubmittingToken}
									class="w-full px-sm py-xs bg-background border border-border-input rounded-input focus:border-taxi-blue focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								{#if tokenError}
									<p class="text-destructive text-sm">{tokenError}</p>
								{/if}
								<p class="text-xs text-foreground-alt">
									Der Token wurde dir beim Einreichen der Geschichte angezeigt.
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
										Token eingeben und fortfahren
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
					<a href="/lesen/{slug}" class="text-taxi-blue hover:underline text-sm">
						← Zurück zur Geschichte
					</a>
				</nav>

				<div class="nk-card text-center">
					<h1 class="mb-sm">Ungültiger Bearbeitungstoken</h1>
					<p class="text-foreground-alt mb-md">
						{tokenValidationResult.reason ||
							'Der eingegebene Token ist nicht gültig für diese Geschichte.'}
					</p>
					<p class="text-sm text-foreground-alt mb-md">
						{#if !tokenParam}
							Der gespeicherte Token wurde entfernt. Bitte gib den korrekten Token für diese
							Geschichte ein.
						{:else}
							Bitte gib den korrekten Token für diese Geschichte ein.
						{/if}
					</p>
					<a
						href="/lesen/{slug}/bearbeiten"
						class="inline-block px-md py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity"
					>
						Token erneut eingeben
					</a>
				</div>
			</div>
		</section>
	{:else if tokenValidationResult && tokenValidationResult.valid}
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
