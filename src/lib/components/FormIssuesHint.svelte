<script lang="ts">
	let { count }: { count: number } = $props();
</script>

<!-- Sits right above the submit button: on small screens the inline field
     messages are often scrolled out of view, so this is the only feedback the user sees -->
{#if count > 0}
	<p role="alert" class="p-sm bg-destructive/10 text-destructive rounded-card text-sm">
		<span class="font-bold">Da fehlt noch etwas.</span>
		Bitte prüfe {count === 1 ? 'den rot markierten Hinweis' : 'die rot markierten Hinweise'} oben
		im Formular.
	</p>
{/if}
