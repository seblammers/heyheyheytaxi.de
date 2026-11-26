import { read } from '$app/server';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import OgImage from '#lib/components/OgImage.svelte';
import zillaSlabRegular from '@fontsource/zilla-slab/files/zilla-slab-latin-400-normal.woff';
import zillaSlabBold from '@fontsource/zilla-slab/files/zilla-slab-latin-700-normal.woff';

// Satori can't read woff2, so the woff files are used. read() loads the bundled
// asset from disk, which avoids fetching fonts from a CDN on every cold start.
let fontsPromise: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700 }[]> | undefined;

function loadFonts() {
	fontsPromise ??= Promise.all([
		read(zillaSlabRegular).arrayBuffer(),
		read(zillaSlabBold).arrayBuffer()
	])
		.then(([regular, bold]) => [
			{ name: 'Zilla Slab', data: regular, weight: 400 as const },
			{ name: 'Zilla Slab', data: bold, weight: 700 as const }
		])
		.catch((error) => {
			// Allow a retry on the next request instead of caching the failure
			fontsPromise = undefined;
			throw error;
		});
	return fontsPromise;
}

/**
 * Renders the branded OG image. URLs carry a content hash (see Meta.svelte),
 * so the default immutable one-year cache header of ImageResponse is safe.
 */
export async function renderOgImage(title: string, description: string) {
	const fonts = await loadFonts();
	return new ImageResponse(OgImage, { fonts }, { title, description });
}
