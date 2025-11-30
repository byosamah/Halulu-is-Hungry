/**
 * Subscription Upgrade Email Template
 *
 * Sent when a user upgrades to Pro.
 * Welcomes them and lists their new benefits.
 *
 * Usage:
 *   const html = subscriptionUpgradeEmailTemplate({
 *     language: 'en',
 *     appUrl: 'https://halulu.food/app',
 *     planName: 'Monthly',
 *   });
 */

import { getEmailTranslations, isRTL as checkIsRTL, type EmailLanguage } from '../translations.js';
import {
  baseEmailTemplate,
  title,
  paragraph,
  primaryButton,
  bulletList,
  highlightBox,
  mutedText,
  spacer,
} from './base-template.js';
import { EMAIL_COLORS, EMAIL_STYLES, getFontFamily } from '../styles.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SubscriptionUpgradeEmailOptions {
  /** Language for the email ('en' or 'ar') */
  language: EmailLanguage;

  /** The URL to the main app */
  appUrl: string;

  /** The plan name (e.g., "Monthly", "Yearly") */
  planName?: string;

  /** Optional user's name for personalized greeting */
  userName?: string;
}

// =============================================================================
// TEMPLATE
// =============================================================================

/**
 * Generate the subscription upgrade email HTML
 *
 * @param options - Template options
 * @returns Complete HTML string for the email
 */
export function subscriptionUpgradeEmailTemplate(options: SubscriptionUpgradeEmailOptions): string {
  const { language, appUrl, planName, userName } = options;

  const isRTL = checkIsRTL(language);
  const t = getEmailTranslations(language);
  const strings = t.subscriptionUpgrade;
  const fontFamily = getFontFamily(isRTL);

  // Personalized greeting if name provided
  const greeting = userName
    ? `${strings.greeting.replace('!', '')} ${userName}!`
    : strings.greeting;

  // Pro badge content
  const proBadgeContent = `
    <p style="margin: 0; text-align: center;">
      <span style="display: inline-block; background-color: ${EMAIL_COLORS.purple}; color: ${EMAIL_COLORS.white}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeBody}; font-weight: 700; padding: 8px 20px; border-radius: 20px;">
        ⭐ PRO ${planName ? `(${planName})` : ''}
      </span>
    </p>
  `;

  // Build the content section
  const content = `
    ${title(strings.title, isRTL)}

    ${paragraph(greeting, isRTL)}

    ${highlightBox(proBadgeContent, isRTL)}

    ${paragraph(strings.body, isRTL)}

    ${paragraph(`<strong>${strings.benefitsTitle}</strong>`, isRTL)}

    ${bulletList(strings.benefits, isRTL)}

    ${primaryButton(strings.buttonText, appUrl, isRTL)}

    ${spacer(16)}

    ${mutedText(strings.enjoyText, isRTL)}
  `;

  // Wrap in base template
  return baseEmailTemplate({
    language,
    content,
    previewText: strings.body.slice(0, 100),
  });
}

/**
 * Get the email subject for subscription upgrade emails
 *
 * @param language - Email language
 * @returns Subject line string
 */
export function getSubscriptionUpgradeEmailSubject(language: EmailLanguage): string {
  const t = getEmailTranslations(language);
  return t.subscriptionUpgrade.subject;
}
