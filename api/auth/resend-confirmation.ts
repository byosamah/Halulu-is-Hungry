// ===========================================
// VERCEL API ROUTE: /api/auth/resend-confirmation
// Resends the email confirmation email to user
// Used when user didn't receive or lost their confirmation email
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// ===========================================
// CONFIGURATION
// ===========================================

// Token expiry: 24 hours for email confirmation
const CONFIRMATION_TOKEN_EXPIRY_HOURS = 24;

// Rate limit: minimum minutes between resends
const RESEND_COOLDOWN_MINUTES = 2;

// Base URL for confirmation links - always use production URL
// Note: VERCEL_URL returns deployment-specific URLs that have protection enabled
const getBaseUrl = () => 'https://www.halulu.food';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Resend confirmation request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, language } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email) {
      console.log('[AUTH] Resend confirmation failed: Missing email');
      return res.status(400).json({ error: 'Email required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[AUTH] Resend confirmation failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const emailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[AUTH] Processing resend confirmation for: ${email}`);

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

    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();

    const users = usersData?.users || [];
    const user = users.find(
      (u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase()
    );

    // Security: Don't reveal if user exists
    if (!user) {
      console.log(`[AUTH] Resend confirmation: User not found for ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a new confirmation link has been sent.',
      });
    }

    // ===========================================
    // Check if already confirmed
    // ===========================================

    if (user.email_confirmed_at) {
      console.log(`[AUTH] Resend confirmation: User already confirmed: ${email}`);
      return res.status(400).json({
        error: 'This email is already confirmed. You can sign in.',
        code: 'ALREADY_CONFIRMED',
      });
    }

    // ===========================================
    // Check rate limit (last token created time)
    // ===========================================

    const { data: existingTokens } = await supabaseAdmin
      .from('email_tokens')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('type', 'confirmation')
      .order('created_at', { ascending: false })
      .limit(1);

    if (existingTokens && existingTokens.length > 0) {
      const lastCreated = new Date(existingTokens[0].created_at);
      const cooldownEnd = new Date(lastCreated.getTime() + RESEND_COOLDOWN_MINUTES * 60 * 1000);

      if (new Date() < cooldownEnd) {
        const waitSeconds = Math.ceil((cooldownEnd.getTime() - Date.now()) / 1000);
        console.log(`[AUTH] Resend confirmation: Rate limited for ${email}`);
        return res.status(429).json({
          error: `Please wait ${waitSeconds} seconds before requesting another confirmation email.`,
          code: 'RATE_LIMITED',
          retryAfter: waitSeconds,
        });
      }
    }

    // ===========================================
    // Delete old confirmation tokens
    // ===========================================

    await supabaseAdmin
      .from('email_tokens')
      .delete()
      .eq('user_id', user.id)
      .eq('type', 'confirmation');

    // ===========================================
    // Generate new token
    // ===========================================

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + CONFIRMATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    const { error: tokenError } = await supabaseAdmin
      .from('email_tokens')
      .insert({
        user_id: user.id,
        token,
        type: 'confirmation',
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error(`[AUTH] Failed to store new token: ${tokenError.message}`);
      return res.status(500).json({ error: 'Failed to process request' });
    }

    // ===========================================
    // Send confirmation email
    // ===========================================

    const baseUrl = getBaseUrl();
    const confirmUrl = `${baseUrl}/auth/confirm?token=${token}`;

    console.log(`[AUTH] Sending new confirmation email to: ${email}`);

    try {
      const emailResponse = await fetch(`${baseUrl}/api/emails/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          language: emailLanguage,
          confirmUrl,
        }),
      });

      if (!emailResponse.ok) {
        console.error('[AUTH] Failed to send confirmation email');
      } else {
        console.log(`[AUTH] Confirmation email resent to: ${email}`);
      }
    } catch (emailError) {
      console.error('[AUTH] Email sending error:', emailError);
    }

    // ===========================================
    // Success response
    // ===========================================

    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a new confirmation link has been sent.',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUTH] Resend confirmation error:', errorMessage);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
