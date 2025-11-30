/**
 * Resend Email Wrapper
 *
 * A reusable function to send emails via the Resend API.
 * All emails from Halulu go through this wrapper for consistency.
 *
 * Usage:
 *   const result = await sendEmail({
 *     to: 'user@example.com',
 *     subject: 'Welcome!',
 *     html: '<h1>Hello</h1>',
 *   });
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SendEmailOptions {
  /** Recipient email address */
  to: string;

  /** Email subject line */
  subject: string;

  /** HTML content of the email */
  html: string;

  /** Optional reply-to address (defaults to eat@halulu.food) */
  replyTo?: string;

  /** Optional custom "from" name (defaults to Halulu) */
  fromName?: string;
}

export interface SendEmailResult {
  /** Whether the email was sent successfully */
  success: boolean;

  /** Resend message ID (for tracking) */
  messageId?: string;

  /** Error message if failed */
  error?: string;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

// Default sender configuration
const DEFAULT_FROM_EMAIL = 'eat@halulu.food';
const DEFAULT_FROM_NAME = 'Halulu';

// Resend API endpoint
const RESEND_API_URL = 'https://api.resend.com/emails';

// =============================================================================
// MAIN FUNCTION
// =============================================================================

/**
 * Send an email via Resend API
 *
 * @param options - Email options (to, subject, html, etc.)
 * @returns Promise with success status and messageId or error
 *
 * @example
 * ```typescript
 * const result = await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Verify your email',
 *   html: confirmationTemplate({ language: 'en', confirmUrl: '...' }),
 * });
 *
 * if (result.success) {
 *   console.log('Email sent:', result.messageId);
 * } else {
 *   console.error('Failed:', result.error);
 * }
 * ```
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, replyTo, fromName } = options;

  // Get API key from environment
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('[EMAIL] Missing RESEND_API_KEY environment variable');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  // Build the "from" address
  const senderName = fromName || DEFAULT_FROM_NAME;
  const fromAddress = `${senderName} <${DEFAULT_FROM_EMAIL}>`;

  try {
    console.log(`[EMAIL] Sending to: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);

    // Call Resend API
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        reply_to: replyTo || DEFAULT_FROM_EMAIL,
        subject: subject,
        html: html,
      }),
    });

    // Handle API response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EMAIL] Resend API error:', response.status, errorText);

      return {
        success: false,
        error: `Resend API error: ${response.status}`,
      };
    }

    // Parse successful response
    const data = await response.json();
    console.log(`[EMAIL] Sent successfully: ${data.id}`);

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error: unknown) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EMAIL] Unexpected error:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validate an email address format
 *
 * @param email - Email address to validate
 * @returns True if valid format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input for safe HTML inclusion
 * Prevents XSS attacks in email content
 *
 * @param text - Text to sanitize
 * @returns Sanitized text safe for HTML
 */
export function sanitizeForHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
