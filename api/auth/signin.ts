// ===========================================
// VERCEL API ROUTE: /api/auth/signin
// Signs in user with email and password
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Signin request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[AUTH] Signin failed: Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    console.log(`[AUTH] Attempting signin for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`[AUTH] Signin failed for ${email}: ${error.message}`);
      return res.status(401).json({ error: error.message });
    }

    console.log(`[AUTH] Signin successful for: ${email}`);

    return res.status(200).json({
      success: true,
      user: data.user,
      session: data.session,
    });

  } catch (error: any) {
    console.error('[AUTH] Signin error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
