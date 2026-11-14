import { env } from '$env/dynamic/private';

interface SendEmailOptions {
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
}

/**
 * Send a plain-text email via the Resend REST API.
 * Uses fetch instead of the Resend SDK to avoid an extra dependency.
 */
export async function sendEmail({ to, subject, text, replyTo }: SendEmailOptions): Promise<void> {
	if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
	if (!env.NOTIFY_FROM_EMAIL) throw new Error('NOTIFY_FROM_EMAIL is not set');

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: env.NOTIFY_FROM_EMAIL,
			to,
			subject,
			text,
			reply_to: replyTo
		})
	});

	if (!response.ok) {
		throw new Error(`Resend API error ${response.status}: ${await response.text()}`);
	}
}
