// ===========================================
// VERCEL API ROUTE: /api/auth/signup
// Creates new user account with CUSTOM email verification
// Uses our branded emails via Resend instead of Supabase defaults
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// ===========================================
// CONFIGURATION
// ===========================================

// Token expiry: 24 hours for email confirmation
const CONFIRMATION_TOKEN_EXPIRY_HOURS = 24;

// Base URL for confirmation links
const getBaseUrl = (req: VercelRequest) => {
  // Use VERCEL_URL in production, or origin header in development
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return req.headers.origin || 'https://www.halulu.food';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[AUTH] Signup request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, language } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email || !password) {
      console.log('[AUTH] Signup failed: Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[AUTH] Signup failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('[AUTH] Signup failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Default to English if no language specified
    const emailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[AUTH] Attempting signup for: ${email} (${emailLanguage})`);

    // ===========================================
    // Create Supabase Admin Client (service role)
    // This allows us to create users without auto-sending Supabase emails
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
    // Check if user already exists
    // ===========================================

    const { data: existingUsers } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      console.log(`[AUTH] Signup failed: Email already exists: ${email}`);
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // ===========================================
    // Create user (without auto-confirmation email)
    // ===========================================

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-confirm - we'll do it via our token
    });

    if (authError) {
      console.log(`[AUTH] Signup failed for ${email}: ${authError.message}`);

      // Handle specific error cases
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      console.log(`[AUTH] Signup failed: No user returned`);
      return res.status(500).json({ error: 'Failed to create account' });
    }

    const userId = authData.user.id;
    console.log(`[AUTH] User created: ${userId}`);

    // ===========================================
    // Generate confirmation token
    // ===========================================

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + CONFIRMATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    console.log(`[AUTH] Generated confirmation token for: ${email}`);

    // ===========================================
    // Store token in database
    // ===========================================

    const { error: tokenError } = await supabaseAdmin
      .from('email_tokens')
      .insert({
        user_id: userId,
        token,
        type: 'confirmation',
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error(`[AUTH] Failed to store token: ${tokenError.message}`);
      // Don't fail signup - user can request new confirmation email
    }

    // ===========================================
    // Send confirmation email via our custom system
    // ===========================================

    const baseUrl = getBaseUrl(req);
    const confirmUrl = `${baseUrl}/auth/confirm?token=${token}`;

    console.log(`[AUTH] Sending confirmation email to: ${email}`);

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
        const errorText = await emailResponse.text();
        console.error(`[AUTH] Failed to send confirmation email: ${errorText}`);
        // Don't fail signup - user can request new confirmation email
      } else {
        console.log(`[AUTH] Confirmation email sent to: ${email}`);
      }
    } catch (emailError) {
      console.error(`[AUTH] Email sending error:`, emailError);
      // Don't fail signup - user can request new confirmation email
    }

    // ===========================================
    // Success response
    // ===========================================

    console.log(`[AUTH] Signup successful for: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Account created. Please check your email to verify.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      // No session returned - user must verify email first
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUTH] Signup error:', errorMessage);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
