/**
 * Supabase Client Configuration
 *
 * This file sets up the Supabase client for authentication and database access.
 *
 * How it works:
 * - Uses your Supabase project URL and anon key from environment variables
 * - Provides a single client instance for the entire app
 * - Handles auth session persistence automatically
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// These are set in your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that credentials exist (helps catch config errors early)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase credentials missing!\n' +
    'Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.\n' +
    'You can find these in your Supabase project settings.'
  );
}

/**
 * Supabase Client
 *
 * Use this client to:
 * - Sign in/Sign up users: supabase.auth.signInWithPassword()
 * - Sign out: supabase.auth.signOut()
 * - Get current user: supabase.auth.getUser()
 * - Query database: supabase.from('table').select()
 *
 * Example usage:
 * ```ts
 * import { supabase } from '@/lib/supabase';
 *
 * // Sign up a new user
 * const { data, error } = await supabase.auth.signUp({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    // Persist session in localStorage (user stays logged in on refresh)
    persistSession: true,
    // Automatically refresh token when it expires
    autoRefreshToken: true,
    // Detect session changes from other tabs
    detectSessionInUrl: true,
  },
});

// Export types for TypeScript support
export type { User, Session } from '@supabase/supabase-js';
