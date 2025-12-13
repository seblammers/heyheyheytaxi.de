import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a cryptographically secure random token (40 characters)
 */
export function generateEditToken(): string {
	return randomBytes(20).toString('hex');
}

/**
 * Hash a token using bcrypt
 */
export async function hashToken(token: string): Promise<string> {
	return bcrypt.hash(token, 10);
}

/**
 * Verify a token against its hash
 */
export async function verifyToken(token: string, hash: string): Promise<boolean> {
	return bcrypt.compare(token, hash);
}
