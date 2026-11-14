export const menuItems = [
	{
		label: 'Startseite',
		href: '/'
	},
	{
		label: 'Geschichten lesen',
		href: '/lesen'
	},
	{
		label: 'Geschichte einreichen',
		href: '/einreichen'
	},
	{
		label: 'Regeln',
		href: '/regeln'
	},
	{
		label: 'Kontakt',
		href: '/kontakt'
	}
];

// Secondary links, shown in the footer only
export const footerItems = [
	{
		label: 'Über das Projekt',
		href: '/ueber'
	},
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
