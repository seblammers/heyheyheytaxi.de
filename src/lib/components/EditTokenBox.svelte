<script lang="ts">
	import { resolve } from '$app/paths';
	import { saveToken } from '#lib/utils/tokenStorage.ts';

	let {
		slug,
		token,
		// When editing, the token is already stored in this browser (edit page reads it from there)
		alreadySaved = false
	}: {
		slug: string;
		token: string;
		alreadySaved?: boolean;
	} = $props();

	let tokenCopied = $state(false);

	function handleSaveToken() {
		saveToken(slug, token);
		alert(
			'Dein Geheimcode ist jetzt in diesem Browser gespeichert! Du kannst deine Geschichte jederzeit bearbeiten.'
		);
	}

	function handleCopyToken() {
		navigator.clipboard.writeText(token).then(() => {
			tokenCopied = true;
			setTimeout(() => {
				tokenCopied = false;
			}, 2000);
		});
	}
</script>

<div class="p-sm bg-background rounded-card border border-border">
	<p class="flex justify-between gap-xs mb-xs text-sm">
		<span class="font-bold">Dein Geheimcode:</span>
		<a href={resolve('/so-gehts#geheimcode')} target="_blank"> Was ist das? </a>
	</p>
	<div class="flex flex-col sm:flex-row sm:items-center gap-xs mb-sm">
		<code class="flex-1 px-sm py-xs bg-background-alt rounded text-sm font-mono break-all">
			{token}
		</code>
		<button
			type="button"
			onclick={handleCopyToken}
			class="nk-button nk-button-sm nk-button-primary"
		>
			{tokenCopied ? '✓ Kopiert' : 'Kopieren'}
		</button>
	</div>
	{#if alreadySaved}
		<p class="text-xs text-foreground-alt">
			Dein Geheimcode ist in diesem Browser gespeichert. Bewahre ihn trotzdem gut auf – mit ihm
			kannst du deine Geschichte auch auf anderen Geräten ändern oder löschen.
		</p>
	{:else}
		<p class="text-xs text-foreground-alt mb-sm">
			⚠️ WICHTIG: Bewahre diesen Code gut auf! Du siehst ihn nur jetzt. Mit ihm kannst du deine
			Geschichte später ändern oder löschen.
		</p>
		<button
			type="button"
			onclick={handleSaveToken}
			class="nk-button nk-button-sm nk-button-primary w-full"
		>
			In Browser speichern
		</button>
	{/if}
</div>
