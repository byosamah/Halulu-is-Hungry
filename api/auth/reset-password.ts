// ===========================================
// VERCEL API ROUTE: /api/auth/reset-password
// Sends password reset email using our CUSTOM branded emails
// Uses Resend instead of Supabase default emails
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// ===========================================
// CONFIGURATION
// ===========================================

// Token expiry: 1 hour for password reset
const RESET_TOKEN_EXPIRY_HOURS = 1;

// Base URL for reset links
const getBaseUrl = (req: VercelRequest) => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return req.headers.origin || 'https://www.halulu.food';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Password reset request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, language } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email) {
      console.log('[AUTH] Reset password failed: Missing email');
      return res.status(400).json({ error: 'Email required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[AUTH] Reset password failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Default to English if no language specified
    const emailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[AUTH] Processing password reset for: ${email} (${emailLanguage})`);

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
    // Find user by email
    // ===========================================

    // First check profiles table
    const { data: profileData } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .limit(1)
      .single();

    // If not found in profiles, try to get from auth
    let userId: string | null = profileData?.id || null;

    if (!userId) {
      // Try to find user in auth.users via admin API
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();

      const users = usersData?.users || [];
      const foundUser = users.find(
        (u: { email?: string; id: string }) => u.email?.toLowerCase() === email.toLowerCase()
      );
      if (foundUser) {
        userId = foundUser.id;
      }
    }

    // ===========================================
    // Security: Don't reveal if user exists or not
    // Always return success message to prevent email enumeration
    // ===========================================

    if (!userId) {
      console.log(`[AUTH] Password reset: User not found for ${email} (not revealing to client)`);
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // ===========================================
    // Delete any existing reset tokens for this user
    // ===========================================

    await supabaseAdmin
      .from('email_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('type', 'password_reset');

    // ===========================================
    // Generate reset token
    // ===========================================

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    console.log(`[AUTH] Generated password reset token for: ${email}`);

    // ===========================================
    // Store token in database
    // ===========================================

    const { error: tokenError } = await supabaseAdmin
      .from('email_tokens')
      .insert({
        user_id: userId,
        token,
        type: 'password_reset',
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error(`[AUTH] Failed to store reset token: ${tokenError.message}`);
      return res.status(500).json({ error: 'Failed to process request' });
    }

    // ===========================================
    // Send password reset email via our custom system
    // ===========================================

    const baseUrl = getBaseUrl(req);
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    console.log(`[AUTH] Sending password reset email to: ${email}`);

    try {
      const emailResponse = await fetch(`${baseUrl}/api/emails/send-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          language: emailLanguage,
          resetUrl,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error(`[AUTH] Failed to send reset email: ${errorText}`);
        // Still return success to prevent email enumeration
      } else {
        console.log(`[AUTH] Password reset email sent to: ${email}`);
      }
    } catch (emailError) {
      console.error(`[AUTH] Email sending error:`, emailError);
      // Still return success to prevent email enumeration
    }

    // ===========================================
    // Success response
    // ===========================================

    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUTH] Reset password error:', errorMessage);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
