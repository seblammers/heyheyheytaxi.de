import { defineEnvVars } from '@sveltejs/kit/env';

// All variables are declared optional on purpose: SvelteKit validates them during
// the build too, and the Docker build runs without any env vars. Required values
// are checked where they are used (e.g. src/lib/server/supabase.ts).
const optional = (input: string | undefined) => input;

export const variables = defineEnvVars({
	RESEND_WEBHOOK_SECRET: { schema: optional },
	NOTIFY_TO_EMAIL: { schema: optional },
	NOTIFY_FROM_EMAIL: { schema: optional },
	RESEND_API_KEY: { schema: optional },
	PUBLIC_SUPABASE_URL: { public: true, schema: optional },
	PUBLIC_SUPABASE_ANON_KEY: { public: true, schema: optional }
});
