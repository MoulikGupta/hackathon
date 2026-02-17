import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the currently authenticated user.
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
}

/**
 * Get the current session.
 * @returns {Promise<{session: object|null, error: object|null}>}
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
}

/**
 * Sign out the current user.
 * @returns {Promise<{error: object|null}>}
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
}
