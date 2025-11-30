// ===========================================
// VERCEL API ROUTE: /api/usage/increment
// Increments user's search count after a search
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[USAGE] Increment usage request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      console.log('[USAGE] Increment failed: Missing userId');
      return res.status(400).json({ error: 'User ID required' });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`[USAGE] Incrementing usage for user: ${userId}`);

    const { data, error } = await supabase.rpc('increment_search_count', {
      p_user_id: userId
    });

    if (error) {
      console.log(`[USAGE] Increment failed: ${error.message}`);

      // If function doesn't exist, just return success
      if (error.message.includes('function') || error.code === '42883') {
        return res.status(200).json({
          success: true,
          isAllowed: true,
        });
      }

      return res.status(400).json({ error: error.message });
    }

    const isAllowed = data && data.length > 0 ? data[0].is_allowed : true;
    const newCount = data && data.length > 0 ? data[0].search_count : 1;

    console.log(`[USAGE] User ${userId}: Search count now ${newCount}, allowed: ${isAllowed}`);

    return res.status(200).json({
      success: true,
      isAllowed,
      searchCount: newCount,
    });

  } catch (error: any) {
    console.error('[USAGE] Increment error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
