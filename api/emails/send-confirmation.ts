/**
 * API Route: /api/emails/send-confirmation
 *
 * Sends the email verification email to new users.
 * Called after signup to verify the user's email address.
 *
 * POST body:
 *   - email: string (recipient email)
 *   - language: 'en' | 'ar'
 *   - confirmUrl: string (verification link)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, isValidEmail } from '../lib/email/send-email.js';
import {
  confirmationEmailTemplate,
  getConfirmationEmailSubject,
} from '../lib/email/templates/confirmation.js';
import type { EmailLanguage } from '../lib/email/translations.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[EMAIL] send-confirmation request at ${new Date().toISOString()}`);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, language, confirmUrl } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email || !confirmUrl) {
      console.log('[EMAIL] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: email, confirmUrl' });
    }

    if (!isValidEmail(email)) {
      console.log('[EMAIL] Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Default to English if no language specified
    const emailLanguage: EmailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[EMAIL] Sending confirmation to: ${email} (${emailLanguage})`);

    // ===========================================
    // Generate email HTML
    // ===========================================

    const html = confirmationEmailTemplate({
      language: emailLanguage,
      confirmUrl,
    });

    const subject = getConfirmationEmailSubject(emailLanguage);

    // ===========================================
    // Send email via Resend
    // ===========================================

    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    if (!result.success) {
      console.error('[EMAIL] Failed to send confirmation:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }

    console.log(`[EMAIL] Confirmation sent successfully: ${result.messageId}`);

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
