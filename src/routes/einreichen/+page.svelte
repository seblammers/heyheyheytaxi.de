<script lang="ts">
	import { resolve } from '$app/paths';
	import Meta from '#lib/components/Meta.svelte';
	import { pageSeo } from '#lib/seo.ts';
	import PostForm from '#lib/components/PostForm.svelte';
</script>

<Meta {...pageSeo('einreichen')} />

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-sm mb-xl text-center">
			<h1>Teile deine Geschichte</h1>
			<p class="text-foreground-alt">
				Hast du dir eine lustige, skurrile oder bewegende Taxi-Geschichte ausgedacht? Teile sie mit
				der Welt!
			</p>
		</header>

		<div class="nk-card">
			<PostForm />
		</div>

		<div class="mt-lg text-center">
			<a href={resolve('/lesen')} class="text-taxi-blue hover:underline text-sm">
				← Andere Geschichten lesen
			</a>
		</div>
	</div>
</section>
