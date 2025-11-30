// ===========================================
// VERCEL API ROUTE: /api/auth/confirm-email
// Verifies email confirmation token and activates user account
// Called when user clicks the link in their confirmation email
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ===========================================
// CONFIGURATION
// ===========================================

// Base URL for redirects and welcome email
const getBaseUrl = (req: VercelRequest) => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return req.headers.origin || 'https://www.halulu.food';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Confirm email request at ${new Date().toISOString()}`);

  // Accept both GET (from email link) and POST (from frontend)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from query string (GET) or body (POST)
    const token = req.method === 'GET' ? req.query.token : req.body.token;
    const language = req.method === 'GET' ? (req.query.language || 'en') : (req.body.language || 'en');

    // ===========================================
    // Validate token
    // ===========================================

    if (!token || typeof token !== 'string') {
      console.log('[AUTH] Confirm email failed: Missing or invalid token');
      return res.status(400).json({
        error: 'Invalid confirmation link',
        code: 'INVALID_TOKEN',
      });
    }

    console.log(`[AUTH] Verifying confirmation token`);

    // ===========================================
    // Create Supabase Admin Client (service role)
    // ===========================================

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // ===========================================
    // Look up token in database
    // ===========================================

    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('email_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'confirmation')
      .single();

    if (tokenError || !tokenData) {
      console.log('[AUTH] Confirm email failed: Token not found');
      return res.status(400).json({
        error: 'Invalid or expired confirmation link',
        code: 'TOKEN_NOT_FOUND',
      });
    }

    // ===========================================
    // Check if token is expired
    // ===========================================

    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);

    if (now > expiresAt) {
      console.log('[AUTH] Confirm email failed: Token expired');

      // Delete expired token
      await supabaseAdmin
        .from('email_tokens')
        .delete()
        .eq('id', tokenData.id);

      return res.status(400).json({
        error: 'This confirmation link has expired. Please request a new one.',
        code: 'TOKEN_EXPIRED',
      });
    }

    // ===========================================
    // Check if token was already used
    // ===========================================

    if (tokenData.used_at) {
      console.log('[AUTH] Confirm email failed: Token already used');
      return res.status(400).json({
        error: 'This confirmation link has already been used.',
        code: 'TOKEN_USED',
      });
    }

    // ===========================================
    // Get user and confirm their email
    // ===========================================

    const userId = tokenData.user_id;

    // Update user to confirm email
    const { data: userData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (updateError) {
      console.error(`[AUTH] Failed to confirm user: ${updateError.message}`);
      return res.status(500).json({
        error: 'Failed to confirm email. Please try again.',
        code: 'CONFIRM_FAILED',
      });
    }

    console.log(`[AUTH] Email confirmed for user: ${userId}`);

    // ===========================================
    // Mark token as used
    // ===========================================

    await supabaseAdmin
      .from('email_tokens')
      .update({ used_at: now.toISOString() })
      .eq('id', tokenData.id);

    // ===========================================
    // Send welcome email
    // ===========================================

    const baseUrl = getBaseUrl(req);
    const userEmail = userData.user?.email;

    if (userEmail) {
      console.log(`[AUTH] Sending welcome email to: ${userEmail}`);

      try {
        const emailResponse = await fetch(`${baseUrl}/api/emails/send-welcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            language: language === 'ar' ? 'ar' : 'en',
            appUrl: `${baseUrl}/app`,
          }),
        });

        if (!emailResponse.ok) {
          console.error('[AUTH] Failed to send welcome email');
        } else {
          console.log(`[AUTH] Welcome email sent to: ${userEmail}`);
        }
      } catch (emailError) {
        console.error('[AUTH] Welcome email error:', emailError);
        // Don't fail - email confirmation was successful
      }
    }

    // ===========================================
    // Success response
    // ===========================================

    console.log(`[AUTH] Email confirmation successful for: ${userEmail}`);

    // For GET requests (direct link click), redirect to app
    if (req.method === 'GET') {
      const redirectUrl = `${baseUrl}/app?confirmed=true`;
      return res.redirect(302, redirectUrl);
    }

    // For POST requests, return JSON
    return res.status(200).json({
      success: true,
      message: 'Email confirmed successfully! You can now sign in.',
      user: {
        id: userData.user?.id,
        email: userData.user?.email,
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUTH] Confirm email error:', errorMessage);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    });
  }
}
