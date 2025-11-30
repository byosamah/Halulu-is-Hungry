// ===========================================
// VERCEL API ROUTE: /api/usage
// Gets user's current search usage stats
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[USAGE] Get usage request at ${new Date().toISOString()}`);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.query.userId as string;

    if (!userId) {
      console.log('[USAGE] Get usage failed: Missing userId');
      return res.status(400).json({ error: 'User ID required' });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`[USAGE] Fetching usage for user: ${userId}`);

    const { data, error } = await supabase.rpc('get_user_usage', {
      p_user_id: userId
    });

    if (error) {
      console.log(`[USAGE] Get usage failed: ${error.message}`);

      // If function doesn't exist, return defaults
      if (error.message.includes('function') || error.code === '42883') {
        return res.status(200).json({
          searchCount: 0,
          searchLimit: 3,
          remaining: 3,
          isPremium: false,
          monthYear: new Date().toISOString().slice(0, 7),
        });
      }

      return res.status(400).json({ error: error.message });
    }

    if (data && data.length > 0) {
      const row = data[0];
      console.log(`[USAGE] User ${userId}: ${row.search_count}/${row.search_limit} searches`);

      return res.status(200).json({
        searchCount: row.search_count,
        searchLimit: row.search_limit,
        remaining: row.remaining,
        isPremium: row.is_premium,
        monthYear: row.month_year,
      });
    }

    // No data - return defaults
    console.log(`[USAGE] No usage data for user ${userId}, returning defaults`);
    return res.status(200).json({
      searchCount: 0,
      searchLimit: 3,
      remaining: 3,
      isPremium: false,
      monthYear: new Date().toISOString().slice(0, 7),
    });

  } catch (error: any) {
    console.error('[USAGE] Get usage error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
