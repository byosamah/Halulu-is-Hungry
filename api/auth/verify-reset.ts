// ===========================================
// VERCEL API ROUTE: /api/auth/verify-reset
// Verifies password reset token and updates password
// Called when user submits new password after clicking reset link
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Verify reset request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!token) {
      console.log('[AUTH] Verify reset failed: Missing token');
      return res.status(400).json({
        error: 'Invalid reset link',
        code: 'INVALID_TOKEN',
      });
    }

    if (!newPassword) {
      console.log('[AUTH] Verify reset failed: Missing new password');
      return res.status(400).json({
        error: 'New password is required',
        code: 'MISSING_PASSWORD',
      });
    }

    if (newPassword.length < 6) {
      console.log('[AUTH] Verify reset failed: Password too short');
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
        code: 'PASSWORD_TOO_SHORT',
      });
    }

    console.log(`[AUTH] Verifying password reset token`);

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
      .eq('type', 'password_reset')
      .single();

    if (tokenError || !tokenData) {
      console.log('[AUTH] Verify reset failed: Token not found');
      return res.status(400).json({
        error: 'Invalid or expired reset link',
        code: 'TOKEN_NOT_FOUND',
      });
    }

    // ===========================================
    // Check if token is expired
    // ===========================================

    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);

    if (now > expiresAt) {
      console.log('[AUTH] Verify reset failed: Token expired');

      // Delete expired token
      await supabaseAdmin
        .from('email_tokens')
        .delete()
        .eq('id', tokenData.id);

      return res.status(400).json({
        error: 'This reset link has expired. Please request a new one.',
        code: 'TOKEN_EXPIRED',
      });
    }

    // ===========================================
    // Check if token was already used
    // ===========================================

    if (tokenData.used_at) {
      console.log('[AUTH] Verify reset failed: Token already used');
      return res.status(400).json({
        error: 'This reset link has already been used.',
        code: 'TOKEN_USED',
      });
    }

    // ===========================================
    // Update user's password
    // ===========================================

    const userId = tokenData.user_id;

    const { data: userData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error(`[AUTH] Failed to update password: ${updateError.message}`);
      return res.status(500).json({
        error: 'Failed to update password. Please try again.',
        code: 'UPDATE_FAILED',
      });
    }

    console.log(`[AUTH] Password updated for user: ${userId}`);

    // ===========================================
    // Mark token as used
    // ===========================================

    await supabaseAdmin
      .from('email_tokens')
      .update({ used_at: now.toISOString() })
      .eq('id', tokenData.id);

    // ===========================================
    // Delete all other reset tokens for this user
    // (Security: invalidate any other pending reset links)
    // ===========================================

    await supabaseAdmin
      .from('email_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('type', 'password_reset')
      .neq('id', tokenData.id);

    // ===========================================
    // Success response
    // ===========================================

    console.log(`[AUTH] Password reset successful for: ${userData.user?.email}`);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now sign in with your new password.',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUTH] Verify reset error:', errorMessage);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    });
  }
}
