import { createClient } from '@supabase/supabase-js';

// Access Environment Variables directly on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Using placeholder key.");
}

// Create a new supabase client with the service role key
// This client should ONLY be used in server-side contexts (API routes, Server Actions)
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = isBuildTime
    ? { from: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }), insert: () => ({ select: () => ({ single: () => ({ data: { id: 0 }, error: null }) }) }), update: () => ({ eq: () => ({ error: null }) }) }) } as any
    : createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
