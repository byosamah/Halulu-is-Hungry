// ===========================================
// VERCEL API ROUTE: /api/auth/signout
// Logs user action (actual signout happens client-side)
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Signout request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email } = req.body;

    // Log the signout event
    console.log(`[AUTH] User signing out: ${email || userId || 'unknown'}`);

    // Note: Actual session invalidation happens client-side with Supabase
    // This endpoint is for logging visibility in Vercel

    return res.status(200).json({
      success: true,
      message: 'Signout logged',
    });

  } catch (error: any) {
    console.error('[AUTH] Signout logging error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
