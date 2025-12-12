import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// For server-side operations, we can use the anon key
// If you need elevated permissions, use SERVICE_ROLE_KEY instead
const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
const supabaseKey = publicEnv.PUBLIC_SUPABASE_ANON_KEY || env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('PUBLIC_SUPABASE_URL is not set');
if (!supabaseKey) throw new Error('PUBLIC_SUPABASE_ANON_KEY is not set');

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});
