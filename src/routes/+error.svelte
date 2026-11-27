<script lang="ts">
	import { resolve } from '$app/paths';
	import Meta from '#lib/components/Meta.svelte';
	import { page } from '$app/state';

	type ErrorCopy = { title: string; text: string };

	// Friendly German copy per status. Unknown 4xx/5xx fall back to the generic entries.
	const copyByStatus: Record<number, ErrorCopy> = {
		400: {
			title: 'Da hat etwas nicht gepasst',
			text: 'Deine Eingabe konnte so nicht verarbeitet werden.'
		},
		403: {
			title: 'Kein Zugriff',
			text: 'Dafür fehlt dir leider die Berechtigung.'
		},
		404: {
			title: 'Huch, hier ist nichts',
			text: 'Diese Seite oder Geschichte gibt es nicht (mehr).'
		},
		429: {
			title: 'Kurz durchatmen',
			text: 'Das waren zu viele Anfragen auf einmal. Bitte versuche es später noch einmal.'
		}
	};

	const clientErrorCopy: ErrorCopy = {
		title: 'Huch, da stimmt was nicht',
		text: 'Bei deiner Anfrage ist etwas schiefgelaufen.'
	};

	const serverErrorCopy: ErrorCopy = {
		title: 'Ups, da ist etwas schiefgelaufen',
		text: 'Das liegt nicht an dir. Bitte versuche es später noch einmal.'
	};

	const status = $derived(page.status);
	const copy = $derived(
		copyByStatus[status] ?? (status >= 500 ? serverErrorCopy : clientErrorCopy)
	);

	// Our own error() calls carry specific German messages (e.g. "Ungültiger
	// Bearbeitungstoken."). Show them for client errors, but not for 404 (SvelteKit
	// uses the English "Not Found" for unknown routes) or 5xx (may be technical).
	const detail = $derived.by(() => {
		const message = page.error?.message;
		if (!message || status === 404 || status >= 500) return null;
		return message === copy.text ? null : message;
	});
</script>

<Meta title={copy.title} />

<section
	class="flex flex-col items-center justify-center mx-auto w-full h-screen max-w-prose px-sm"
>
	<div class="flex flex-col gap-md w-full">
		<p class="text-sm font-bold text-foreground-alt">Fehler {status}</p>
		<h1 class="text-4xl font-bold">{copy.title}</h1>
		<p class="text-xl">{copy.text}</p>
		{#if detail}
			<p class="p-sm bg-destructive/10 text-destructive rounded-card">{detail}</p>
		{/if}
		<p class="text-xl">Magst du stattdessen:</p>
		<div class="flex flex-col sm:flex-row gap-sm mt-md">
			<a href={resolve('/lesen')} class="nk-button nk-button-primary"> Geschichten lesen </a>
			<a href={resolve('/einreichen')} class="nk-button nk-button-secondary">
				Geschichte einreichen
			</a>
		</div>
	</div>
</section>
