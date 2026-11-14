import sanitizeHtml from 'sanitize-html';

/**
 * Allowlist matching what SimpleEditor (TipTap StarterKit, reduced) can produce.
 * Anything else – scripts, event handlers, links, images, styles – is stripped,
 * because a crafted request can bypass the editor entirely.
 */
const options: sanitizeHtml.IOptions = {
	allowedTags: ['p', 'br', 'strong', 'em', 'u'],
	allowedAttributes: {},
	disallowedTagsMode: 'discard'
};

export function sanitizeStoryHtml(html: string): string {
	return sanitizeHtml(html, options);
}

/** Plain-text length, used to re-validate content after sanitizing */
export function textLength(html: string): number {
	return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim().length;
}
