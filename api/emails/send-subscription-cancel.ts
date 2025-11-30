/**
 * API Route: /api/emails/send-subscription-cancel
 *
 * Sends the subscription cancellation email.
 * Called when a user cancels their Pro subscription.
 *
 * POST body:
 *   - email: string (recipient email)
 *   - language: 'en' | 'ar'
 *   - accessEndsAt: string (formatted date when access ends)
 *   - reactivateUrl?: string (link to pricing page)
 *   - userName?: string (optional personalization)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, isValidEmail } from '../lib/email/send-email.js';
import {
  subscriptionCancelEmailTemplate,
  getSubscriptionCancelEmailSubject,
} from '../lib/email/templates/subscription-cancel.js';
import type { EmailLanguage } from '../lib/email/translations.js';

// Default pricing URL
const DEFAULT_PRICING_URL = 'https://www.halulu.food/pricing';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[EMAIL] send-subscription-cancel request at ${new Date().toISOString()}`);

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, language, accessEndsAt, reactivateUrl, userName } = req.body;

    // ===========================================
    // Validate inputs
    // ===========================================

    if (!email || !accessEndsAt) {
      console.log('[EMAIL] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: email, accessEndsAt' });
    }

    if (!isValidEmail(email)) {
      console.log('[EMAIL] Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Default to English if no language specified
    const emailLanguage: EmailLanguage = language === 'ar' ? 'ar' : 'en';

    console.log(`[EMAIL] Sending subscription cancel to: ${email} (${emailLanguage})`);

    // ===========================================
    // Generate email HTML
    // ===========================================

    const html = subscriptionCancelEmailTemplate({
      language: emailLanguage,
      reactivateUrl: reactivateUrl || DEFAULT_PRICING_URL,
      accessEndsAt,
      userName,
    });

    const subject = getSubscriptionCancelEmailSubject(emailLanguage);

    // ===========================================
    // Send email via Resend
    // ===========================================

    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    if (!result.success) {
      console.error('[EMAIL] Failed to send subscription cancel:', result.error);
      return res.status(500).json({ error: result.error || 'Failed to send email' });
    }

    console.log(`[EMAIL] Subscription cancel sent successfully: ${result.messageId}`);

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
