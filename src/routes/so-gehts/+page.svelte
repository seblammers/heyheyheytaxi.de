<svelte:head>
	<title>So funktioniert's | Hey, hey, hey, Taxi!</title>
	<meta
		name="description"
		content="Was ist der Geheimcode, wie bewahrst du ihn auf – und wofür wir deine E-Mail benutzen (und wofür nie)."
	/>
</svelte:head>

<section class="nk-section">
	<div class="nk-container max-w-prose">
		<header class="flex flex-col gap-sm mb-xl text-center">
			<h1>So funktioniert's</h1>
			<p class="text-foreground-alt">
				Wie funktioniert diese Internetseite? Hier musst du kein Konto anlegen und dir kein Passwort
				ausdenken. Stattdessen bekommst du nach dem Einreichen einen Geheimcode.
			</p>
		</header>

		<div class="nk-card flex flex-col gap-md">
			<div id="geheimcode" class="flex flex-col gap-3xs scroll-mt-lg">
				<h2 class="text-xl font-bold">Was ist der Geheimcode?</h2>
				<p class="text-foreground-alt">
					Der Geheimcode ist wie ein Schlüssel zu deiner Geschichte. Nur wer ihn hat, kann die
					Geschichte später ändern oder löschen. Jede Geschichte hat ihren eigenen Code. Du siehst
					ihn nur ein einziges Mal: direkt nach dem Einreichen.
				</p>
				<p class="text-foreground-alt">
					Wir kennen deinen Code selbst nicht. Wir speichern nur eine verschlüsselte Version, mit
					der wir prüfen können, ob er passt. Deshalb können wir ihn dir auch nicht noch einmal
					schicken.
				</p>
			</div>

			<div
				id="aufbewahren"
				class="flex flex-col gap-3xs pt-md border-t border-border-card scroll-mt-lg"
			>
				<h2 class="text-xl font-bold">Wie bewahre ich ihn gut auf?</h2>
				<ul class="flex flex-col gap-3xs nk-ul text-foreground-alt ml-sm">
					<li>
						<strong>Im Browser speichern:</strong> Ein Klick, und dein Browser merkt sich den Code. Das
						klappt aber nur auf diesem Gerät. Wenn du deinen Browserverlauf löschst, ist der Code weg.
					</li>
					<li>
						<strong>Aufschreiben:</strong> Kopier ihn in eine Notiz, mach ein Foto oder schreib ihn auf
						einen Zettel. Oder falls du schon erwachsen bist: ab damit in deinen Passwort-Manager!
					</li>
				</ul>
				<p class="text-foreground-alt"><br />Unser Tipp: Mach am besten beides.</p>
			</div>

			<div id="email" class="flex flex-col gap-sm pt-md border-t border-border-card scroll-mt-lg">
				<h2 class="text-xl font-bold">
					Nur Code oder Code + <span class="whitespace-nowrap">E-Mail?</span> Du entscheidest.
				</h2>
				<div class="nk-inset flex flex-col gap-3xs">
					<h3 class="font-bold">Nur der Geheimcode</h3>
					<p class="text-foreground-alt">
						Du verrätst uns nichts über dich. Aber wenn du den Code verlierst, können wir nicht
						erkennen, dass die Geschichte von dir ist. Dann kannst du sie nicht mehr ändern.
					</p>
				</div>
				<div class="nk-inset flex flex-col gap-3xs">
					<h3 class="font-bold">Geheimcode + E-Mail</h3>
					<p class="text-foreground-alt">
						Wenn du den Code verlierst, schreib uns von derselben E-Mail-Adresse. So sehen wir, dass
						die Geschichte von dir ist, und helfen dir weiter. Und falls wir deine Geschichte nicht
						veröffentlichen können, sagen wir dir, warum. Dann kannst du sie überarbeiten.
					</p>
				</div>
				<p class="text-foreground-alt">
					Bist du noch ein Kind? Dann frag am besten deine Eltern, ob ihr eine E-Mail-Adresse
					angeben wollt.
				</p>
			</div>

			<div
				id="versprechen"
				class="flex flex-col gap-3xs pt-md border-t border-border-card scroll-mt-lg"
			>
				<h2 class="text-xl font-bold">Unser Versprechen zu deiner E-Mail</h2>
				<ul class="flex flex-col gap-3xs nk-ul text-foreground-alt ml-sm">
					<li>Wir schicken dir <strong>niemals</strong> Werbung oder Newsletter.</li>
					<li>Wir schreiben dir nur, wenn es um eine Geschichte geht, die du eingereicht hast.</li>
					<li>
						Wenn du deinen Code verloren hast und uns schreibst, nutzen wir deine E-Mail nur, um zu
						prüfen, dass die Geschichte wirklich von dir ist.
					</li>
					<li>Deine E-Mail wird nie veröffentlicht und nie an andere weitergegeben.</li>
					<li>
						Du kannst sie jederzeit löschen lassen. Mehr dazu steht in der
						<a href="/datenschutz">Datenschutzerklärung</a>.
					</li>
				</ul>
			</div>

			<div class="nk-inset text-sm text-foreground-alt">
				<p>
					Code verloren oder noch Fragen?
					<a href="/kontakt">Schreib uns</a>.
				</p>
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
				← Andere Geschichten lesen
			</a>
		</div>
	</div>
</section>
