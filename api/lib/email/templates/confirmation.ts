/**
 * Confirmation Email Template
 *
 * Sent when a user signs up to verify their email address.
 * Contains a verification link that expires in 24 hours.
 *
 * Usage:
 *   const html = confirmationEmailTemplate({
 *     language: 'en',
 *     confirmUrl: 'https://halulu.food/auth/confirm?token=xxx',
 *   });
 */

import { getEmailTranslations, isRTL as checkIsRTL, type EmailLanguage } from '../translations.js';
import {
  baseEmailTemplate,
  title,
  paragraph,
  primaryButton,
  mutedText,
  spacer,
} from './base-template.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ConfirmationEmailOptions {
  /** Language for the email ('en' or 'ar') */
  language: EmailLanguage;

  /** The URL the user clicks to confirm their email */
  confirmUrl: string;

  /** Optional user's name for personalized greeting */
  userName?: string;
}

// =============================================================================
// TEMPLATE
// =============================================================================

/**
 * Generate the confirmation email HTML
 *
 * @param options - Template options
 * @returns Complete HTML string for the email
 */
export function confirmationEmailTemplate(options: ConfirmationEmailOptions): string {
  const { language, confirmUrl, userName } = options;

  const isRTL = checkIsRTL(language);
  const t = getEmailTranslations(language);
  const strings = t.confirmation;

  // Build the content section
  const content = `
    ${title(strings.title, isRTL)}

    ${paragraph(strings.greeting, isRTL)}

    ${paragraph(strings.body, isRTL)}

    ${primaryButton(strings.buttonText, confirmUrl, isRTL)}

    ${spacer(8)}

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
 * Get the email subject for confirmation emails
 *
 * @param language - Email language
 * @returns Subject line string
 */
export function getConfirmationEmailSubject(language: EmailLanguage): string {
  const t = getEmailTranslations(language);
  return t.confirmation.subject;
}
