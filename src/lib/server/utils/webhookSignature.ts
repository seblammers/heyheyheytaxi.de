import { createHmac, timingSafeEqual } from 'node:crypto';

// Reject webhooks older/newer than this to prevent replay attacks
const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verify a Svix-signed webhook (used by Resend).
 * Implemented by hand to avoid pulling in the `svix` package for ~20 lines.
 * @see https://docs.svix.com/receiving/verifying-payloads/how-manual
 */
export function verifyWebhookSignature(rawBody: string, headers: Headers, secret: string): boolean {
	const id = headers.get('svix-id');
	const timestamp = headers.get('svix-timestamp');
	const signatureHeader = headers.get('svix-signature');
	if (!id || !timestamp || !signatureHeader) return false;

	const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
	if (!Number.isFinite(ageSeconds) || ageSeconds > TOLERANCE_SECONDS) return false;

	// Secret has the form "whsec_<base64>"; only the base64 part is the HMAC key
	const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
	const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest();

	// Header may contain several space-separated signatures, e.g. "v1,abc v1,def"
	return signatureHeader.split(' ').some((entry) => {
		const [version, signature] = entry.split(',');
		if (version !== 'v1' || !signature) return false;
		const received = Buffer.from(signature, 'base64');
		return received.length === expected.length && timingSafeEqual(received, expected);
	});
}
