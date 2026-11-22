<script lang="ts">
	let { count }: { count: number } = $props();

	let hintElement = $state<HTMLElement>();

	function jumpToFirstIssue() {
		// SvelteKit remote form fields set aria-invalid on inputs that have issues
		const invalidField = hintElement
			?.closest('form')
			?.querySelector<HTMLElement>('[aria-invalid="true"]');
		if (!invalidField) return;

		const fieldWrapper = invalidField.closest<HTMLElement>('label, div') ?? invalidField;
		// Rich-text fields submit via a visually hidden textarea; focus the visible editor instead
		const focusTarget =
			fieldWrapper.querySelector<HTMLElement>('[contenteditable="true"]') ?? invalidField;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		fieldWrapper.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
		focusTarget.focus({ preventScroll: true });
	}
</script>

<!-- Sits right above the submit button: on small screens the inline field
     messages are often scrolled out of view, so this is the only feedback the user sees -->
{#if count > 0}
	<div
		bind:this={hintElement}
		role="alert"
		class="p-sm bg-destructive/10 text-destructive rounded-card text-sm"
	>
		<span class="font-bold">Da fehlt noch etwas.</span>
		Bitte prüfe {count === 1 ? 'den rot markierten Hinweis' : 'die rot markierten Hinweise'} oben im Formular.
		<button type="button" onclick={jumpToFirstIssue} class="font-bold underline hover:no-underline">
			Zum {count === 1 ? 'Hinweis' : 'ersten Hinweis'} springen ↑
		</button>
	</div>
{/if}
