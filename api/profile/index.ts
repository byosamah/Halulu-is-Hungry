// ===========================================
// VERCEL API ROUTE: /api/profile
// Fetches user profile from Supabase
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[PROFILE] Request at ${new Date().toISOString()}`);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      console.log('[PROFILE] Missing userId');
      return res.status(400).json({ error: 'User ID required' });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`[PROFILE] Fetching profile for user: ${userId}`);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.log(`[PROFILE] Error: ${error.message}`);
      return res.status(404).json({ error: 'Profile not found', details: error.message });
    }

    console.log(`[PROFILE] Found profile for: ${data.email || userId}`);

    return res.status(200).json({
      id: data.id,
      email: data.email,
      display_name: data.display_name,
      avatar_emoji: data.avatar_emoji,
      avatar_bg_color: data.avatar_bg_color,
      is_premium: data.is_premium,
      subscription_status: data.subscription_status,
      subscription_variant: data.subscription_variant,
      subscription_ends_at: data.subscription_ends_at,
      created_at: data.created_at,
    });

  } catch (error: any) {
    console.error('[PROFILE] Unexpected error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
