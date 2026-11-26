export const siteName = 'Hey, hey, hey, Taxi!';

export const defaultDescription =
	'Hey, hey, hey, Taxi! ist eine Internetseite für all eure Taxi-Geschichten.';

export const storyDescription =
	'Eine Geschichte aus der freien, offenen Sammlung von Taxi-Geschichten auf heyheyheytaxi.de.';

type PageSeo = { title?: string; description?: string };

// Shared by the pages and the OG image endpoint, so the preview image always
// shows the same text as the page's <title> and description
const pages = {
	home: {},
	ueber: {
		title: 'Über das Projekt',
		description:
			'Wie diese Seite entstanden ist – und die beiden Bücher, die uns dazu inspiriert haben.'
	},
	regeln: {
		title: 'Regeln',
		description:
			'Regeln und Richtlinien für das Einreichen von Taxi-Geschichten auf Hey, hey, hey, Taxi!'
	},
	kontakt: {
		title: 'Kontakt',
		description: 'So erreichst du das Team hinter Hey, hey, hey, Taxi!'
	},
	lesen: {
		title: 'Alle Geschichten',
		description: 'Alle Taxi-Geschichten unserer Community.'
	},
	'so-gehts': {
		title: "So funktioniert's",
		description:
			'Was ist der Geheimcode, wie bewahrst du ihn auf – und wofür wir deine E-Mail benutzen (und wofür nie).'
	},
	einreichen: {
		title: 'Geschichte einreichen',
		description:
			'Teile deine Taxi-Geschichte mit der Community. Egal ob lustig, skurril oder bewegend – wir freuen uns auf deine Geschichte!'
	}
} satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof pages;

/** Meta props for a static page, including its generated OG image */
export function pageSeo(key: PageKey): PageSeo & { image: string } {
	return { ...pages[key], image: `/og/seite/${key}.png` };
}

/** Looks up a static page by an untrusted key (e.g. a route param) */
export function findPageSeo(key: string): PageSeo | undefined {
	return Object.hasOwn(pages, key) ? pages[key as PageKey] : undefined;
}
