import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { sendEmail } from '$lib/server/mail';
import { verifyWebhookSignature } from '$lib/server/utils/webhookSignature';
import type { RequestHandler } from './$types';

interface InboundEmail {
	from?: string;
	to?: string[] | string;
	subject?: string;
}

// Resend posts here when a mail arrives at hallo@… – we only send a heads-up,
// the actual reply happens in the Resend dashboard.
export const POST: RequestHandler = async ({ request }) => {
	const secret = env.RESEND_WEBHOOK_SECRET;
	const notifyTo = env.NOTIFY_TO_EMAIL;
	if (!secret || !notifyTo) {
		console.error('Resend webhook: RESEND_WEBHOOK_SECRET or NOTIFY_TO_EMAIL is not set');
		return json({ error: 'Not configured' }, { status: 500 });
	}

	// Signature is computed over the raw body, so read it as text before parsing
	const rawBody = await request.text();
	if (!verifyWebhookSignature(rawBody, request.headers, secret)) {
		return json({ error: 'Invalid signature' }, { status: 401 });
	}

	const event = JSON.parse(rawBody);
	if (event.type !== 'inbox.email.received' && event.type !== 'email.received') {
		// Acknowledge other events so Resend doesn't retry them
		return json({});
	}

	// Payload shape differs between docs and examples – accept both
	const email: InboundEmail = event.data?.email ?? event.data ?? {};
	const from = email.from ?? 'unbekannt';
	const subject = email.subject || '(kein Betreff)';
	const to = [email.to ?? []].flat().join(', ');

	// Guard against a mail loop if the notification address is itself an inbound address
	// NOTIFY_FROM_EMAIL may be "Name <addr>", so compare only the address part
	const senderAddress = env.NOTIFY_FROM_EMAIL?.match(/<(.+)>/)?.[1] ?? env.NOTIFY_FROM_EMAIL;
	if (senderAddress && from.includes(senderAddress)) return json({});

	try {
		await sendEmail({
			to: notifyTo,
			subject: `Neue Nachricht an ${to || 'hallo@'}: ${subject}`,
			text: [
				'Neue E-Mail eingegangen.',
				'',
				`Von: ${from}`,
				`An: ${to}`,
				`Betreff: ${subject}`,
				'',
				'Antworten im Resend-Dashboard: https://resend.com/emails'
			].join('\n')
		});
	} catch (error) {
		console.error('Resend webhook: failed to send notification', error);
		// Non-2xx makes Resend retry the webhook later
		return json({ error: 'Notification failed' }, { status: 502 });
	}

	return json({});
};
