// ===========================================
// VERCEL API ROUTE: /api/auth/update-password
// Updates user's password (after reset link clicked)
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Update password request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, newPassword } = req.body;

    if (!newPassword) {
      console.log('[AUTH] Update password failed: Missing new password');
      return res.status(400).json({ error: 'New password required' });
    }

    if (!accessToken) {
      console.log('[AUTH] Update password failed: Missing access token');
      return res.status(400).json({ error: 'Access token required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    console.log('[AUTH] Attempting to update password');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log(`[AUTH] Update password failed: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }

    console.log('[AUTH] Password updated successfully');

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });

  } catch (error: any) {
    console.error('[AUTH] Update password error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
