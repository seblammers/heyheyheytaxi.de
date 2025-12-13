import { PersistedState } from 'runed';

// Reactive token storage using PersistedState
// Automatically persists to localStorage and syncs across tabs
export const tokens = new PersistedState<Record<string, string>>('heyheyheytaxi-edit-tokens', {});

/**
 * Save a token for a story slug
 */
export function saveToken(slug: string, token: string): void {
	try {
		tokens.current = {
			...tokens.current,
			[slug]: token
		};
	} catch (error) {
		console.error('[tokenStorage] Error saving token:', error);
		// Gracefully handle localStorage errors (private browsing, quota exceeded, etc.)
	}
}

/**
 * Get token for a story slug
 */
export function getToken(slug: string): string | null {
	try {
		return tokens.current[slug] || null;
	} catch (error) {
		console.error('[tokenStorage] Error getting token:', error);
		return null;
	}
}

/**
 * Get all stored tokens
 */
export function getAllTokens(): Record<string, string> {
	try {
		return { ...tokens.current };
	} catch (error) {
		console.error('[tokenStorage] Error getting all tokens:', error);
		return {};
	}
}

/**
 * Remove token for a story slug
 */
export function removeToken(slug: string): void {
	try {
		const newTokens = { ...tokens.current };
		delete newTokens[slug];
		tokens.current = newTokens;
	} catch (error) {
		console.error('[tokenStorage] Error removing token:', error);
	}
}

/**
 * Check if a token exists for a story slug
 */
export function hasToken(slug: string): boolean {
	try {
		return slug in tokens.current && !!tokens.current[slug];
	} catch (error) {
		console.error('[tokenStorage] Error checking token:', error);
		return false;
	}
}
