/**
 * Password Reset Email Template
 *
 * Sent when a user requests to reset their password.
 * Contains a reset link that expires in 1 hour.
 *
 * Usage:
 *   const html = passwordResetEmailTemplate({
 *     language: 'en',
 *     resetUrl: 'https://halulu.food/auth/reset?token=xxx',
 *   });
 */

import { getEmailTranslations, isRTL as checkIsRTL, type EmailLanguage } from '../translations.js';
import {
  baseEmailTemplate,
  title,
  paragraph,
  primaryButton,
  mutedText,
  highlightBox,
  spacer,
} from './base-template.js';
import { EMAIL_COLORS } from '../styles.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PasswordResetEmailOptions {
  /** Language for the email ('en' or 'ar') */
  language: EmailLanguage;

  /** The URL the user clicks to reset their password */
  resetUrl: string;
}

// =============================================================================
// TEMPLATE
// =============================================================================

/**
 * Generate the password reset email HTML
 *
 * @param options - Template options
 * @returns Complete HTML string for the email
 */
export function passwordResetEmailTemplate(options: PasswordResetEmailOptions): string {
  const { language, resetUrl } = options;

  const isRTL = checkIsRTL(language);
  const t = getEmailTranslations(language);
  const strings = t.passwordReset;

  // Security note box content
  const securityNoteContent = `
    <p style="margin: 0; color: ${EMAIL_COLORS.dark}; font-weight: 600;">
      🔒 ${strings.securityNote}
    </p>
  `;

  // Build the content section
  const content = `
    ${title(strings.title, isRTL)}

    ${paragraph(strings.greeting, isRTL)}

    ${paragraph(strings.body, isRTL)}

    ${primaryButton(strings.buttonText, resetUrl, isRTL)}

    ${spacer(8)}

    ${highlightBox(securityNoteContent, isRTL)}

    ${mutedText(`⏰ ${strings.expiry}`, isRTL)}

    ${mutedText(strings.ignoreMessage, isRTL)}
  `;

  // Wrap in base template
  return baseEmailTemplate({
    language,
    content,
    previewText: strings.body.slice(0, 100),
  });
}

/**
 * Get the email subject for password reset emails
 *
 * @param language - Email language
 * @returns Subject line string
 */
export function getPasswordResetEmailSubject(language: EmailLanguage): string {
  const t = getEmailTranslations(language);
  return t.passwordReset.subject;
}
