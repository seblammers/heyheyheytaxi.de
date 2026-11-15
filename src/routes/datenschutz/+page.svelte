<script lang="ts">
	import ObfuscatedEmail from '$lib/components/ObfuscatedEmail.svelte';
</script>

<svelte:head>
	<title>Datenschutz | Hey, hey, hey, Taxi!</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-3xs mb-xl text-center">
			<h1>Datenschutzerklärung</h1>
			<p class="text-foreground-alt">
				Kurz gesagt: Wir sammeln nur, was für die Geschichten nötig ist. Kein Tracking, keine
				Cookies, keine Werbung.
			</p>
		</header>

		<div class="nk-card flex flex-col gap-md">
			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">1. Verantwortlicher</h2>
				<p class="text-foreground-alt">
					Sebastian Lammers, c/o nussknagger GmbH, Warthestr. 1, 12051 Berlin<br />
					E-Mail: <ObfuscatedEmail /><br />
					Weitere Angaben findest du im
					<a href="/impressum" class="text-taxi-blue hover:underline font-medium">Impressum</a>.
				</p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">2. Hosting und Server-Logs</h2>
				<p class="text-foreground-alt">
					Website und Datenbank laufen auf einem eigenen Server bei der Hetzner Online GmbH in
					Deutschland. Beim Aufruf der Seite verarbeitet der Server technisch notwendige Daten (z.
					B. IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Browser-Typ), um die Seite
					auszuliefern und vor Missbrauch zu schützen. Diese Zugriffsprotokolle werden nur
					kurzfristig aufbewahrt und nicht ausgewertet.
				</p>
				<p class="text-foreground-alt">
					Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und funktionierenden
					Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
				</p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">3. Wenn du eine Geschichte einreichst</h2>
				<p class="text-foreground-alt">Wir speichern in unserer Datenbank:</p>
				<ul class="flex flex-col gap-3xs list-disc list-outside pl-[1.25em] text-foreground-alt ml-sm">
					<li>Titel und Text deiner Geschichte</li>
					<li>
						deinen Namen (Pflichtfeld, gern ein Pseudonym) – er wird zusammen mit der Geschichte
						veröffentlicht, weil die Lizenz eine Namensnennung verlangt
					</li>
					<li>
						deine E-Mail-Adresse, falls du sie freiwillig angibst – sie wird nicht veröffentlicht
						und nur genutzt, um dir Rückmeldung zu deiner Geschichte zu geben oder deine
						Urheberschaft zu bestätigen
					</li>
					<li>Datum der Einreichung und ggf. der letzten Bearbeitung</li>
					<li>
						deinen Bearbeitungstoken, allerdings nur als verschlüsselten Hash – den Token selbst
						kennen nur du und dein Browser
					</li>
				</ul>
				<p class="text-foreground-alt">
					Rechtsgrundlage ist deine Einwilligung beim Einreichen (Art. 6 Abs. 1 lit. a DSGVO). Die
					Daten bleiben gespeichert, bis du deine Geschichte mit deinem Token löschst oder uns um
					Löschung bittest.
				</p>
				<p class="text-foreground-alt">
					Zum Schutz vor Spam wird deine IP-Adresse beim Einreichen kurzzeitig im Arbeitsspeicher
					des Servers gehalten, um zu viele Einreichungen in kurzer Zeit zu verhindern. Sie wird
					dabei nicht dauerhaft gespeichert und spätestens nach wenigen Stunden verworfen.
				</p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">4. Speicherung in deinem Browser</h2>
				<p class="text-foreground-alt">
					Wenn du nach dem Einreichen auf „In Browser speichern“ klickst, legen wir deinen
					Bearbeitungstoken im lokalen Speicher (localStorage) deines Browsers ab. So kannst du
					deine Geschichte später bearbeiten oder löschen, ohne den Token erneut einzugeben. Der
					Token verlässt deinen Browser nur, wenn du eine Geschichte bearbeitest oder löschst. Du
					kannst ihn jederzeit über die Einstellungen deines Browsers entfernen.
				</p>
				<p class="text-foreground-alt">
					Diese Speicherung erfolgt nur auf deinen ausdrücklichen Wunsch und ist für diese Funktion
					unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
				</p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">5. Wenn du uns schreibst</h2>
				<p class="text-foreground-alt">
					Schreibst du uns eine E-Mail, verarbeiten wir deine Adresse und deine Nachricht, um dir zu
					antworten (Art. 6 Abs. 1 lit. f DSGVO). Wir löschen die Nachricht, sobald sie nicht mehr
					benötigt wird.
				</p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">6. Keine Cookies, kein Tracking, keine Drittanbieter</h2>
				<p class="text-foreground-alt">
					Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge.
					Schriften und alle anderen Inhalte werden direkt von unserem Server geladen, nicht von
					externen Diensten. Links zu anderen Seiten (z. B. Creative Commons oder dem Verlag der
					Bücher) werden erst aufgerufen, wenn du sie anklickst.
				</p>
			</div>

			<div class="flex flex-col gap-3xs">
				<h2 class="text-xl font-bold">7. Deine Rechte</h2>
				<p class="text-foreground-alt">Du hast jederzeit das Recht auf:</p>
				<ul class="flex flex-col gap-3xs list-disc list-outside pl-[1.25em] text-foreground-alt ml-sm">
					<li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
					<li>Berichtigung (Art. 16 DSGVO) und Löschung (Art. 17 DSGVO)</li>
					<li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
					<li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
					<li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
					<li>Widerruf deiner Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
				</ul>
				<p class="text-foreground-alt">
					Schreib uns dafür einfach eine E-Mail an <ObfuscatedEmail />. Außerdem kannst du dich bei
					einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Berliner Beauftragten
					für Datenschutz und Informationsfreiheit (Art. 77 DSGVO).
				</p>
			</div>

			<p class="text-sm text-foreground-alt pt-md border-t border-border-card">
				Stand: November 2026
			</p>
		</div>
	</div>
</section>
