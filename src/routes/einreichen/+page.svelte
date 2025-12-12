<script lang="ts">
	import PostForm from '$lib/components/PostForm.svelte';
</script>

<svelte:head>
	<title>Geschichte einreichen | Hey, hey, hey, Taxi!</title>
	<meta
		name="description"
		content="Teile deine Taxi-Geschichte mit der Community. Egal ob lustig, skurril oder bewegend – wir freuen uns auf deine Erlebnisse!"
	/>
</svelte:head>

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-sm mb-xl text-center">
			<h1>Teile deine Geschichte</h1>
			<p class="text-foreground-alt">
				Hast du eine lustige, skurrile oder bewegende Taxi-Geschichte erlebt? Teile sie mit uns und
				unserer Community!
			</p>
		</header>

		<div class="nk-card">
			<PostForm />
		</div>

		<div class="mt-lg text-center">
			<a href="/lesen" class="text-taxi-blue hover:underline text-sm">
				← Andere Geschichten lesen
			</a>
		</div>
	</div>
</section>
