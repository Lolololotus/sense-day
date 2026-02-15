import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validation for development debugging
if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
        console.error("CRITICAL: Supabase client environment variables are missing!");
    }
}

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : { from: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }) }) } as any;

export type User = {
    id: string;
    wallet_address: string | null;
    birth_date: string | null;
    saju_ilgan: string | null;
    astrology_sun_sign: string | null;
    created_at: string;
};

export type ChatLog = {
    id: string;
    user_id: string | null;
    session_id: string | null;
    user_message: string;
    ai_response: any;
    created_at: string;
};
