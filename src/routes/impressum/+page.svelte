<script lang="ts">
	import Meta from '#lib/components/Meta.svelte';
	import ObfuscatedEmail from '#lib/components/ObfuscatedEmail.svelte';
</script>

<Meta title="Impressum" noindex />

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-3xs mb-xl text-center">
			<h1>Impressum</h1>
		</header>

		<div class="nk-card flex flex-col gap-md">
			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">Angaben gemäß § 5 DDG</h2>
				<address class="not-italic text-foreground-alt">
					Sebastian Lammers<br />
					c/o nussknagger GmbH<br />
					Warthestr. 1<br />
					12051 Berlin
				</address>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">Kontakt</h2>
				<p class="text-foreground-alt">E-Mail: <ObfuscatedEmail /></p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
				<p class="text-foreground-alt">Sebastian Lammers (Anschrift wie oben)</p>
			</div>

			<div class="flex flex-col gap-3xs pt-md border-t border-border-card">
				<h2 class="text-xl font-bold">Hinweis</h2>
				<p class="text-foreground-alt">
					Hey, hey, hey, Taxi! ist ein privates, nicht-kommerzielles Projekt. Die Geschichten auf
					dieser Seite stammen von den jeweils genannten Autorinnen und Autoren und werden vor der
					Veröffentlichung geprüft. Mehr dazu erfährst du auf der Seite
					<a href="/ueber">Über das Projekt</a>.
				</p>
			</div>
		</div>
	</div>
</section>
