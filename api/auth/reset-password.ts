// ===========================================
// VERCEL API ROUTE: /api/auth/reset-password
// Sends password reset email
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Password reset request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, redirectTo } = req.body;

    if (!email) {
      console.log('[AUTH] Reset password failed: Missing email');
      return res.status(400).json({ error: 'Email required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    console.log(`[AUTH] Sending password reset email to: ${email}`);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${req.headers.origin}/auth/reset-password`,
    });

    if (error) {
      console.log(`[AUTH] Reset password failed for ${email}: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    console.log(`[AUTH] Password reset email sent to: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });

  } catch (error: any) {
    console.error('[AUTH] Reset password error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
