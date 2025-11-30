/**
 * API Route: /api/emails/send-password-reset
 *
 * Sends the password reset email to users.
 * Called when a user requests to reset their password.
 *
 * POST body:
 *   - email: string (recipient email)
 *   - language: 'en' | 'ar'
 *   - resetUrl: string (password reset link)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, isValidEmail } from '../lib/email/send-email.js';
import {
  passwordResetEmailTemplate,
  getPasswordResetEmailSubject,
} from '../lib/email/templates/password-reset.js';
import type { EmailLanguage } from '../lib/email/translations.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[EMAIL] send-password-reset request at ${new Date().toISOString()}`);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, language, resetUrl } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email || !resetUrl) {
      console.log('[EMAIL] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: email, resetUrl' });
    }

    if (!isValidEmail(email)) {
      console.log('[EMAIL] Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Default to English if no language specified
    const emailLanguage: EmailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[EMAIL] Sending password reset to: ${email} (${emailLanguage})`);

    // ===========================================
    // Generate email HTML
    // ===========================================

    const html = passwordResetEmailTemplate({
      language: emailLanguage,
      resetUrl,
    });

    const subject = getPasswordResetEmailSubject(emailLanguage);

    // ===========================================
    // Send email via Resend
    // ===========================================

    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    if (!result.success) {
      console.error('[EMAIL] Failed to send password reset:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }

    console.log(`[EMAIL] Password reset sent successfully: ${result.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: result.messageId,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EMAIL] Unexpected error:', errorMessage);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
