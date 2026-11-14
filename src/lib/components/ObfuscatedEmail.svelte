<script lang="ts">
	import { onMount } from 'svelte';
	import { contactEmail } from '$lib/config';

	let { class: className = '' }: { class?: string } = $props();

	// The address is only assembled in the browser, so it never appears in the
	// server-rendered HTML that most scrapers read. Without JS a readable but
	// non-parsable fallback is shown.
	let address = $state<string | null>(null);

	onMount(() => {
		address = [contactEmail.user, contactEmail.domain].join('@');
	});
</script>

{#if address}
	<a href="mailto:{address}" class="text-taxi-blue hover:underline font-medium {className}"
		>{address}</a
	>
{:else}
	<span class={className}
		>{contactEmail.user} (at) {contactEmail.domain.replace('.', ' (punkt) ')}</span
	>
{/if}
