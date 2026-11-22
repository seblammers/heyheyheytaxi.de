import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/public';

// For server-side operations, we can use the anon key
// If you need elevated permissions, use SERVICE_ROLE_KEY instead
if (!PUBLIC_SUPABASE_URL) throw new Error('PUBLIC_SUPABASE_URL is not set');
if (!PUBLIC_SUPABASE_ANON_KEY) throw new Error('PUBLIC_SUPABASE_ANON_KEY is not set');

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});
