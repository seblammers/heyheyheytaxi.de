/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a database-backed solution
 */

interface RateLimitEntry {
	count: number;
	resetAt: number;
	lastAttempt: number;
}

// In-memory store (clears on server restart)
// In production, use Redis or database
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_ATTEMPTS_PER_HOUR = 10; // Maximum attempts per IP per hour
const MAX_ATTEMPTS_PER_MINUTE = 3; // Maximum attempts per IP per minute (stricter)

/**
 * Check if an IP address has exceeded rate limits
 * @param identifier - IP address or other identifier
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(identifier: string): {
	allowed: boolean;
	remaining: number;
	resetAt: number;
} {
	const now = Date.now();
	const entry = rateLimitStore.get(identifier);

	if (!entry) {
		// First attempt - allow it
		rateLimitStore.set(identifier, {
			count: 1,
			resetAt: now + RATE_LIMIT_WINDOW,
			lastAttempt: now
		});
		return {
			allowed: true,
			remaining: MAX_ATTEMPTS_PER_HOUR - 1,
			resetAt: now + RATE_LIMIT_WINDOW
		};
	}

	// Check if window has expired
	if (now > entry.resetAt) {
		// Reset the counter
		rateLimitStore.set(identifier, {
			count: 1,
			resetAt: now + RATE_LIMIT_WINDOW,
			lastAttempt: now
		});
		return {
			allowed: true,
			remaining: MAX_ATTEMPTS_PER_HOUR - 1,
			resetAt: now + RATE_LIMIT_WINDOW
		};
	}

	// Check per-minute limit (stricter)
	const timeSinceLastAttempt = now - entry.lastAttempt;
	if (timeSinceLastAttempt < 60 * 1000 && entry.count >= MAX_ATTEMPTS_PER_MINUTE) {
		// Too many attempts in the last minute
		return {
			allowed: false,
			remaining: 0,
			resetAt: entry.resetAt
		};
	}

	// Check per-hour limit
	if (entry.count >= MAX_ATTEMPTS_PER_HOUR) {
		return {
			allowed: false,
			remaining: 0,
			resetAt: entry.resetAt
		};
	}

	// Increment counter
	entry.count++;
	entry.lastAttempt = now;
	rateLimitStore.set(identifier, entry);

	return {
		allowed: true,
		remaining: MAX_ATTEMPTS_PER_HOUR - entry.count,
		resetAt: entry.resetAt
	};
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
	// Try various headers (in order of preference)
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		// X-Forwarded-For can contain multiple IPs, take the first one
		return forwarded.split(',')[0].trim();
	}

	const realIP = request.headers.get('x-real-ip');
	if (realIP) {
		return realIP.trim();
	}

	// Fallback (shouldn't happen in production with proper proxy)
	return 'unknown';
}

/**
 * Clean up old entries (call periodically to prevent memory leaks)
 */
export function cleanupRateLimitStore(): void {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) {
		if (now > entry.resetAt + RATE_LIMIT_WINDOW) {
			// Entry is old, remove it
			rateLimitStore.delete(key);
		}
	}
}

// Clean up every hour
if (typeof setInterval !== 'undefined') {
	setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
}
