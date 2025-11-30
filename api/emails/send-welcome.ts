/**
 * API Route: /api/emails/send-welcome
 *
 * Sends the welcome email after a user verifies their email.
 * Celebrates their signup and shows them what they can do.
 *
 * POST body:
 *   - email: string (recipient email)
 *   - language: 'en' | 'ar'
 *   - appUrl: string (link to the app)
 *   - userName?: string (optional personalization)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, isValidEmail } from '../../lib/email/send-email';
import {
  welcomeEmailTemplate,
  getWelcomeEmailSubject,
} from '../../lib/email/templates/welcome';
import type { EmailLanguage } from '../../lib/email/translations';

// Default app URL
const DEFAULT_APP_URL = 'https://www.halulu.food/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[EMAIL] send-welcome request at ${new Date().toISOString()}`);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, language, appUrl, userName } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email) {
      console.log('[EMAIL] Missing required fields');
      return res.status(400).json({ error: 'Missing required field: email' });
    }

    if (!isValidEmail(email)) {
      console.log('[EMAIL] Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Default to English if no language specified
    const emailLanguage: EmailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[EMAIL] Sending welcome to: ${email} (${emailLanguage})`);

    // ===========================================
    // Generate email HTML
    // ===========================================

    const html = welcomeEmailTemplate({
      language: emailLanguage,
      appUrl: appUrl || DEFAULT_APP_URL,
      userName,
    });

    const subject = getWelcomeEmailSubject(emailLanguage);

    // ===========================================
    // Send email via Resend
    // ===========================================

    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    if (!result.success) {
      console.error('[EMAIL] Failed to send welcome:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }

    console.log(`[EMAIL] Welcome sent successfully: ${result.messageId}`);

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
