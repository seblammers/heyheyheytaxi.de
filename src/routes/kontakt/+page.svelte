<script lang="ts">
	import ObfuscatedEmail from '$lib/components/ObfuscatedEmail.svelte';
</script>

<svelte:head>
	<title>Kontakt | Hey, hey, hey, Taxi!</title>
	<meta name="description" content="So erreichst du das Team hinter Hey, hey, hey, Taxi!" />
</svelte:head>

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-3xs mb-xl text-center">
			<h1>Kontakt</h1>
			<p class="text-foreground-alt">Wir freuen uns, von dir zu hören!</p>
		</header>

		<div class="nk-card flex flex-col gap-md">
			<div class="flex flex-col gap-3xs">
				<p class="text-lg">Schreib uns einfach eine E-Mail:</p>
				<p class="text-xl"><ObfuscatedEmail /></p>
			</div>

			<div class="flex flex-col gap-3xs pt-md border-t border-border-card">
				<h2 class="text-xl font-bold">Wobei wir dir helfen können</h2>
				<ul class="flex flex-col gap-3xs list-disc list-outside pl-[1.25em] text-foreground-alt ml-sm">
					<li>
						<strong>Fragen zu den Regeln:</strong> Du bist unsicher, ob deine Geschichte passt? Frag
						einfach – oder schau vorher in die
						<a href="/regeln" class="text-taxi-blue hover:underline font-medium">Regeln</a>.
					</li>
					<li>
						<strong>Geschichte melden:</strong> Dir ist eine Geschichte aufgefallen, die gegen die Regeln
						verstößt? Schick uns bitte den Link dazu.
					</li>
					<li>
						<strong>Token verloren:</strong> Wenn du beim Einreichen deine E-Mail-Adresse angegeben hast,
						können wir deine Urheberschaft darüber bestätigen.
					</li>
					<li>
						<strong>Löschung oder Auskunft:</strong> Alles rund um deine Daten findest du auch in
						der
						<a href="/datenschutz" class="text-taxi-blue hover:underline font-medium"
							>Datenschutzerklärung</a
						>.
					</li>
					<li><strong>Feedback und alles andere:</strong> Immer her damit!</li>
				</ul>
			</div>
		</div>
	</div>
</section>
