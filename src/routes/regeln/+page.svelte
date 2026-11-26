<script lang="ts">
	import Meta from '#lib/components/Meta.svelte';
	import { pageSeo } from '#lib/seo.ts';
</script>

<Meta {...pageSeo('regeln')} />

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-3xs mb-xl text-center">
			<h1>Regeln & Richtlinien</h1>
			<p class="text-foreground-alt">
				Hier findest du alle Regeln und Richtlinien für das Einreichen von Geschichten.
			</p>
		</header>

		<div class="nk-card">
			<div class="flex flex-col gap-md">
				<div class="flex flex-col gap-3xs">
					<h2>Kurzversion</h2>
					<p class="text-lg font-semibold text-foreground-alt">
						Sei respektvoll zu allen Menschen und schreibe Geschichten, die Kindern guttun!
					</p>
				</div>

				<div class="flex flex-col gap-md pt-md border-t border-border-card">
					<h2>Ausführliche Guidelines</h2>
					<p class="text-foreground-alt">
						Damit sich alle wohlfühlen, gibt es ein paar wichtige Regeln:
					</p>
				</div>

				<div class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">1. Respektiere alle Menschen</h3>
					<p class="text-foreground-alt">
						Geschichten dürfen nicht abwertend sein gegenüber Menschen wegen:
					</p>
					<ul class="flex flex-col gap-3xs nk-ul text-foreground-alt ml-sm">
						<li>ihrer Herkunft oder Hautfarbe</li>
						<li>ihrer Religion oder Weltanschauung</li>
						<li>ihrer Sprache oder Kultur</li>
						<li>ihres Geschlechts oder wen sie lieben</li>
						<li>einer Behinderung oder Besonderheit</li>
						<li>ihres Aussehens oder ihrer Familie</li>
					</ul>
				</div>

				<div class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">2. Keine Gewaltverherrlichung</h3>
					<p class="text-foreground-alt">
						Konflikte dürfen in Geschichten vorkommen, aber schreibe nichts, das Gewalt als cool
						oder nachahmenswert darstellt.
					</p>
				</div>

				<div class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">3. Keine gemeinen Schimpfwörter oder Beleidigungen</h3>
					<p class="text-foreground-alt">Die Sprache sollte für Kinder angemessen sein.</p>
				</div>

				<div class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">4. Schwierige Themen sind erlaubt</h3>
					<p class="text-foreground-alt">
						Geschichten über Trauer, Verlust, Angst oder andere ernste Gefühle sind willkommen, wenn
						sie einfühlsam und altersgerecht erzählt werden.
					</p>
				</div>

				<div class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">5. Keine sexuellen Inhalte</h3>
					<p class="text-foreground-alt">
						Geschichten über Liebe und Freundschaft sind schön, aber sexuelle Inhalte gehören nicht
						hierher.
					</p>
				</div>

				<div class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">6. Sei ehrlich</h3>
					<p class="text-foreground-alt">
						Kopiere keine fremden Geschichten. Teile nur eigene Werke oder solche, für die du die
						Erlaubnis hast.
					</p>
				</div>

				<div id="ki" class="flex flex-col gap-3xs">
					<h3 class="text-xl font-bold">7. Keine reinen KI-Geschichten</h3>
					<p class="text-foreground-alt">
						Im Zentrum dieses Projekts steht die Phantasie der Menschen. Die zwei Bücher laden zum
						Weitererzählen und Neuerfinden ein – und dabei kommt jeder Mensch auf ganz eigene Ideen.
						Genau an diesen Ideen sind wir interessiert, nicht an KI-generierten.
					</p>
					<p class="text-foreground-alt">
						Deshalb veröffentlichen wir keine Geschichten, die ausschließlich mit KI erstellt
						wurden.
					</p>
				</div>

				<div id="ablehnung" class="flex flex-col gap-3xs pt-md border-t border-border-card">
					<h3 class="text-xl font-bold">Was passiert bei Ablehnung?</h3>
					<p class="text-foreground-alt">
						Geschichten, die gegen unsere Regeln verstoßen werden nicht veröffentlicht. Falls du uns
						bei der Einreichung deine E-Mail-Adresse mitgeteilt hast, bekommst du eine kurze
						Erklärung und kannst die Geschichte überarbeiten und erneut einreichen.
					</p>
				</div>

				<div id="lizenz" class="flex flex-col gap-md pt-md border-t border-border-card">
					<h2 class="text-2xl font-bold">Lizenz & Urheberrecht</h2>

					<div class="nk-inset">
						<p class="font-bold mb-xs">
							Alle Geschichten stehen unter der Creative Commons Attribution-ShareAlike 4.0
							International Lizenz (CC BY-SA 4.0)
						</p>
						<a
							href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
							target="_blank"
							rel="noopener noreferrer"
							class="text-taxi-blue hover:underline text-sm"
						>
							→ Was bedeutet CC BY-SA 4.0?
						</a>
					</div>

					<div class="flex flex-col gap-3xs">
						<h3 class="text-xl font-bold">Das bedeutet für dich als Autor:</h3>
						<ul class="flex flex-col gap-3xs nk-ul text-foreground-alt ml-sm">
							<li>Du behältst das Urheberrecht an deiner Geschichte</li>
							<li>Deine Geschichte kann frei geteilt und verbreitet werden</li>
							<li>
								Du wirst immer mit dem Namen genannt, den du beim Einreichen angibst – gern auch ein
								Pseudonym
							</li>
							<li>Andere dürfen deine Geschichte auch kommerziell nutzen</li>
							<li>
								<strong>Wichtig:</strong> Bearbeitungen müssen ebenfalls unter CC BY-SA 4.0 veröffentlicht
								werden
							</li>
						</ul>
					</div>

					<div class="flex flex-col gap-3xs">
						<h3 class="text-xl font-bold">Das bedeutet für die Plattform:</h3>
						<ul class="flex flex-col gap-3xs nk-ul text-foreground-alt ml-sm">
							<li>Wir dürfen deine Geschichte auf Social Media teilen</li>

							<li>Wir werden dich immer als Autor nennen</li>
						</ul>
					</div>

					<div class="flex flex-col gap-3xs">
						<h3 class="text-xl font-bold">Das bedeutet für andere Nutzer:</h3>
						<ul class="flex flex-col gap-3xs nk-ul text-foreground-alt ml-sm">
							<li>Sie dürfen Geschichten kopieren und weitergeben</li>
							<li>Sie dürfen sie auch für kommerzielle Zwecke nutzen</li>
							<li>Sie müssen den Autor nennen und auf diese Plattform verlinken</li>
							<li>
								Wenn sie eine Geschichte bearbeiten oder in ein Werk einbinden, muss dieses Werk
								ebenfalls unter CC BY-SA 4.0 stehen
							</li>
						</ul>
					</div>

					<div class="nk-inset text-sm text-foreground-alt">
						<p>
							<strong>Mit dem Einreichen stimmst du dieser Lizenzierung zu.</strong> Falls du Fragen
							dazu hast,
							<a href="/kontakt">kontaktiere uns</a> bitte vor dem Einreichen.
						</p>
					</div>
				</div>

				<div class="flex flex-col gap-3xs pt-md border-t border-border-card">
					<h2 class="text-xl font-bold">Fragen?</h2>
					<p class="text-foreground-alt">
						Falls du unsicher bist, ob deine Geschichte den Richtlinien entspricht, kannst du sie
						gern trotzdem einreichen. Wir prüfen jede Geschichte individuell.

						<a href="/kontakt">Schreib uns einfach eine E-Mail, falls du weitere Fragen hast</a>.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-lg flex flex-col gap-3xs text-center">
			<a
				href="/einreichen"
				class="inline-block px-lg py-sm bg-taxi-blue text-taxi-yellow font-bold rounded-button hover:opacity-90 transition-opacity"
			>
				Geschichte einreichen
			</a>
			<a href="/lesen" class="text-taxi-blue hover:underline text-sm">
				← Zurück zu allen Geschichten
			</a>
		</div>
	</div>
</section>
