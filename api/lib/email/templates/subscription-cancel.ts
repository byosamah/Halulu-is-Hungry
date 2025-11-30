/**
 * Subscription Cancel Email Template
 *
 * Sent when a user cancels their Pro subscription.
 * Shows them when their access ends and encourages reactivation.
 *
 * Usage:
 *   const html = subscriptionCancelEmailTemplate({
 *     language: 'en',
 *     reactivateUrl: 'https://halulu.food/pricing',
 *     accessEndsAt: '2025-12-31',
 *   });
 */

import { getEmailTranslations, isRTL as checkIsRTL, type EmailLanguage } from '../translations.js';
import {
  baseEmailTemplate,
  title,
  paragraph,
  secondaryButton,
  bulletList,
  highlightBox,
  mutedText,
  spacer,
} from './base-template.js';
import { EMAIL_COLORS, EMAIL_STYLES, getFontFamily } from '../styles.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SubscriptionCancelEmailOptions {
  /** Language for the email ('en' or 'ar') */
  language: EmailLanguage;

  /** The URL to reactivate subscription (pricing page) */
  reactivateUrl: string;

  /** When the user's Pro access ends (formatted date string) */
  accessEndsAt: string;

  /** Optional user's name for personalized greeting */
  userName?: string;
}

// =============================================================================
// TEMPLATE
// =============================================================================

/**
 * Generate the subscription cancel email HTML
 *
 * @param options - Template options
 * @returns Complete HTML string for the email
 */
export function subscriptionCancelEmailTemplate(options: SubscriptionCancelEmailOptions): string {
  const { language, reactivateUrl, accessEndsAt, userName } = options;

  const isRTL = checkIsRTL(language);
  const t = getEmailTranslations(language);
  const strings = t.subscriptionCancel;
  const fontFamily = getFontFamily(isRTL);
  const textAlign = isRTL ? 'right' : 'left';

  // Personalized greeting if name provided
  const greeting = userName ? `${strings.greeting} ${userName},` : strings.greeting;

  // Access ends date box content
  const accessEndsContent = `
    <p style="margin: 0; text-align: center; font-family: ${fontFamily};">
      <span style="color: ${EMAIL_COLORS.dark}; font-weight: 600;">
        ${strings.accessUntilLabel}
      </span>
      <br>
      <span style="font-size: ${EMAIL_STYLES.fontSizeTitle}; font-weight: 700; color: ${EMAIL_COLORS.coral};">
        ${accessEndsAt}
      </span>
    </p>
  `;

  // Build the content section
  const content = `
    ${title(strings.title, isRTL)}

    ${paragraph(greeting, isRTL)}

    ${paragraph(strings.body, isRTL)}

    ${highlightBox(accessEndsContent, isRTL)}

    ${paragraph(`<strong>${strings.whatYouLose}</strong>`, isRTL)}

    ${bulletList(strings.lostFeatures, isRTL)}

    ${spacer(8)}

    ${secondaryButton(strings.buttonText, reactivateUrl, isRTL)}

    ${spacer(16)}

    ${mutedText(strings.missYouText, isRTL)}
  `;

  // Wrap in base template
  return baseEmailTemplate({
    language,
    content,
    previewText: strings.body.slice(0, 100),
  });
}

/**
 * Get the email subject for subscription cancel emails
 *
 * @param language - Email language
 * @returns Subject line string
 */
export function getSubscriptionCancelEmailSubject(language: EmailLanguage): string {
  const t = getEmailTranslations(language);
  return t.subscriptionCancel.subject;
}
