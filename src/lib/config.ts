type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

// Content pages grouped by visitor intent; shown in both main menu and footer.
// Home is reachable via the logo, so it is intentionally not listed.
export const navGroups: NavGroup[] = [
	{
		label: 'Mitmachen',
		items: [
			{ label: 'Geschichten lesen', href: '/lesen' },
			{ label: 'Geschichte einreichen', href: '/einreichen' }
		]
	},
	{
		label: 'Gut zu wissen',
		items: [
			{ label: 'Über das Projekt', href: '/ueber' },
			{ label: "So funktioniert's", href: '/so-gehts' },
			{ label: 'Regeln', href: '/regeln' },
			{ label: 'Kontakt', href: '/kontakt' }
		]
	}
];

// Legally required pages, shown in the footer only
export const legalItems: NavItem[] = [
	{
		label: 'Impressum',
		href: '/impressum'
	},
	{
		label: 'Datenschutz',
		href: '/datenschutz'
	}
];

// Split on purpose: assembled client-side by ObfuscatedEmail to keep it out of the HTML
export const contactEmail = {
	user: 'hallo',
	domain: 'heyheyheytaxi.de'
};
