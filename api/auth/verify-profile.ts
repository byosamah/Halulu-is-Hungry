// ===========================================
// VERCEL API ROUTE: /api/auth/verify-profile
// Checks if a user profile exists in the database
// Used during auth initialization to detect deleted users
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Verify profile request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      console.log('[AUTH] Verify profile: Missing userId');
      return res.status(400).json({ error: 'User ID required' });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`[AUTH] Verifying profile exists for: ${userId}`);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.log(`[AUTH] Profile NOT found for user: ${userId}`);
      return res.status(200).json({ exists: false });
    }

    console.log(`[AUTH] Profile exists for user: ${userId}`);
    return res.status(200).json({ exists: true });

  } catch (error: any) {
    console.error('[AUTH] Verify profile error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
