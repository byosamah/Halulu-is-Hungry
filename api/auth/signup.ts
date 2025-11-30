// ===========================================
// VERCEL API ROUTE: /api/auth/signup
// Creates new user account with email verification
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Signup request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, redirectTo } = req.body;

    if (!email || !password) {
      console.log('[AUTH] Signup failed: Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Create Supabase client (uses anon key for auth operations)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    console.log(`[AUTH] Attempting signup for: ${email}`);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo || `${req.headers.origin}/app`,
      },
    });

    if (error) {
      console.log(`[AUTH] Signup failed for ${email}: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    console.log(`[AUTH] Signup successful for: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Account created. Please check your email to verify.',
      user: data.user,
      session: data.session, // May be null if email confirmation required
    });

  } catch (error: any) {
    console.error('[AUTH] Signup error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
