<script lang="ts">
	const books = [
		{
			title: 'Hey, hey, hey, Taxi!',
			authors: 'Saša Stanišić & Katja Spitzer',
			href: 'https://www.mairisch.de/programm/sasa-stanisic-katja-spitzer-hey-hey-hey-taxi/'
		},
		{
			title: 'Hey, hey, hey, Taxi! 2',
			authors: 'Saša Stanišić, Nikolai Stanišić & Katja Spitzer',
			href: 'https://www.mairisch.de/programm/sasa-stanisic-nikolai-stanisic-katja-spitzer-hey-hey-hey-taxi-2/'
		}
	];
</script>

<svelte:head>
	<title>Über das Projekt | Hey, hey, hey, Taxi!</title>
	<meta
		name="description"
		content="Wie diese Seite entstanden ist – und die beiden Bücher, die uns dazu inspiriert haben."
	/>
</svelte:head>

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-3xs mb-xl text-center">
			<h1>Über das Projekt</h1>
		</header>

		<div class="nk-card flex flex-col gap-md">
			<div class="flex flex-col gap-sm text-lg">
				<p>
					Meine Tochter und ich haben die beiden „Hey, hey, hey, Taxi!“-Bücher zusammen gelesen –
					und wir lieben sie beide.
				</p>
				<p>
					Das Schönste an den Büchern: Sie laden dazu ein, sich eigene Taxi-Geschichten auszudenken.
					Genau das haben wir gemacht. Und irgendwann habe ich mich gefragt, ob es in anderen
					Familien, Kitas und Klassenzimmern wohl genauso ist.
				</p>
				<p>
					Deshalb gibt es diese Seite: einen freien, offenen Ort, an dem all diese Geschichten ein
					Zuhause finden und von allen gelesen und weitererzählt werden dürfen.
				</p>
				<p class="text-foreground-alt">– Sebastian</p>
			</div>

			<div class="flex flex-col gap-sm pt-md border-t border-border-card">
				<h2 class="text-xl font-bold">Die Bücher</h2>
				<p class="text-foreground-alt">
					Wenn du die Bücher noch nicht kennst: Lies sie! Sie sind im mairisch Verlag erschienen.
				</p>
				<ul class="flex flex-col gap-sm">
					{#each books as book (book.href)}
						<li class="p-sm bg-background-alt rounded-card">
							<a
								href={book.href}
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-col gap-3xs group"
							>
								<span class="font-bold text-taxi-blue group-hover:underline">{book.title}</span>
								<span class="text-sm text-foreground-alt">{book.authors}</span>
								<span class="text-sm text-taxi-blue">Beim mairisch Verlag ansehen →</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<p class="text-sm text-foreground-alt pt-md border-t border-border-card">
				Diese Seite ist ein privates Fan-Projekt und steht in keiner Verbindung zu den Autorinnen
				und Autoren oder zum Verlag der Bücher.
			</p>
		</div>

		<div class="mt-lg flex flex-col sm:flex-row gap-sm justify-center">
			<a
				href="/lesen"
				class="px-lg py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button text-center hover:opacity-90 transition-opacity"
			>
				Geschichten lesen
			</a>
			<a
				href="/einreichen"
				class="px-lg py-sm bg-background text-taxi-blue font-bold rounded-button text-center border-2 border-taxi-blue hover:bg-taxi-blue hover:text-taxi-yellow transition-colors"
			>
				Geschichte einreichen
			</a>
		</div>
	</div>
</section>
