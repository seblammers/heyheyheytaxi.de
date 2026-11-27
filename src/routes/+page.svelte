<script lang="ts">
	import { resolve } from '$app/paths';
	import Meta from '#lib/components/Meta.svelte';
	import { pageSeo } from '#lib/seo.ts';
	import TaxiHeyIntro from '#lib/components/TaxiHeyIntro.svelte';
</script>

<Meta {...pageSeo('home')} />

<section
	class="flex flex-col items-center justify-center mx-auto w-full h-screen max-w-prose px-sm"
>
	<div class="flex flex-col gap-md w-full">
		<TaxiHeyIntro class="self-center" />
		<h1 class="text-4xl font-bold">Hey, hey, hey, Taxi!</h1>
		<p class="text-xl">
			Ich steige in ein Taxi, und das Taxi ist eine Internetseite und die Internetseite ist das
			Zuhause für alle Taxi-Geschichten.
		</p>
		<p class="text-foreground-alt">
			Du weißt nicht, worum es geht?
			<a href={resolve('/ueber')}>Hier erklären wir dir, was los ist.</a>
		</p>
		<div class="flex flex-col sm:flex-row gap-sm mt-md">
			<a href={resolve('/lesen')} class="nk-button nk-button-primary"> Geschichten lesen </a>
			<a href={resolve('/einreichen')} class="nk-button nk-button-secondary">
				Geschichte einreichen
			</a>
		</div>
	</div>
</section>
