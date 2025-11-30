/**
 * Welcome Email Template
 *
 * Sent after a user verifies their email address.
 * Celebrates their signup and shows them what they can do.
 *
 * Usage:
 *   const html = welcomeEmailTemplate({
 *     language: 'en',
 *     appUrl: 'https://halulu.food/app',
 *   });
 */

import { getEmailTranslations, isRTL as checkIsRTL, type EmailLanguage } from '../translations';
import {
  baseEmailTemplate,
  title,
  paragraph,
  primaryButton,
  bulletList,
  mutedText,
  spacer,
} from './base-template';

// =============================================================================
// TYPES
// =============================================================================

export interface WelcomeEmailOptions {
  /** Language for the email ('en' or 'ar') */
  language: EmailLanguage;

  /** The URL to the main app */
  appUrl: string;

  /** Optional user's name for personalized greeting */
  userName?: string;
}

// =============================================================================
// TEMPLATE
// =============================================================================

/**
 * Generate the welcome email HTML
 *
 * @param options - Template options
 * @returns Complete HTML string for the email
 */
export function welcomeEmailTemplate(options: WelcomeEmailOptions): string {
  const { language, appUrl, userName } = options;

  const isRTL = checkIsRTL(language);
  const t = getEmailTranslations(language);
  const strings = t.welcome;

  // Personalized greeting if name provided
  const greeting = userName
    ? `${strings.greeting.replace('!', '')} ${userName}!`
    : strings.greeting;

  // Build the content section
  const content = `
    ${title(strings.title, isRTL)}

    ${paragraph(greeting, isRTL)}

    ${paragraph(strings.body, isRTL)}

    ${bulletList(strings.features, isRTL)}

    ${primaryButton(strings.buttonText, appUrl, isRTL)}

    ${spacer(16)}

    ${mutedText(strings.closingText, isRTL)}
  `;

  // Wrap in base template
  return baseEmailTemplate({
    language,
    content,
    previewText: strings.body.slice(0, 100),
  });
}

/**
 * Get the email subject for welcome emails
 *
 * @param language - Email language
 * @returns Subject line string
 */
export function getWelcomeEmailSubject(language: EmailLanguage): string {
  const t = getEmailTranslations(language);
  return t.welcome.subject;
}
