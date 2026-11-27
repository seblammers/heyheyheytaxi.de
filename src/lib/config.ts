import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';

// Paths are resolved once here so links respect the base path and match page.url.pathname
type NavItem = { label: string; href: ResolvedPathname };
type NavGroup = { label: string; items: NavItem[] };

// Content pages grouped by visitor intent; shown in both main menu and footer.
// Home is reachable via the logo, so it is intentionally not listed.
export const navGroups: NavGroup[] = [
	{
		label: 'Mitmachen',
		items: [
			{ label: 'Geschichten lesen', href: resolve('/lesen') },
			{ label: 'Geschichte einreichen', href: resolve('/einreichen') }
		]
	},
	{
		label: 'Gut zu wissen',
		items: [
			{ label: 'Über das Projekt', href: resolve('/ueber') },
			{ label: "So funktioniert's", href: resolve('/so-gehts') },
			{ label: 'Regeln', href: resolve('/regeln') },
			{ label: 'Kontakt', href: resolve('/kontakt') }
		]
	}
];

// Legally required pages, shown in the footer only
export const legalItems: NavItem[] = [
	{
		label: 'Impressum',
		href: resolve('/impressum')
	},
	{
		label: 'Datenschutz',
		href: resolve('/datenschutz')
	}
];

// Split on purpose: assembled client-side by ObfuscatedEmail to keep it out of the HTML
export const contactEmail = {
	user: 'hallo',
	domain: 'heyheyheytaxi.de'
};
