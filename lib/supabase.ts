import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
