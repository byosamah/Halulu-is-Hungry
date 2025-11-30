/**
 * Email System - Main Exports
 *
 * Import everything you need from here:
 *   import { sendEmail, confirmationEmailTemplate, EMAIL_COLORS } from '@/lib/email';
 */

// =============================================================================
// CORE UTILITIES
// =============================================================================

export { sendEmail, isValidEmail, sanitizeForHtml } from './send-email';
export type { SendEmailOptions, SendEmailResult } from './send-email';

// =============================================================================
// DESIGN TOKENS
// =============================================================================

export {
  EMAIL_COLORS,
  EMAIL_STYLES,
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
  containerStyle,
  headerStyle,
  contentStyle,
  footerStyle,
  getHighlightBoxStyle,
  titleStyle,
  bodyTextStyle,
  mutedTextStyle,
  linkStyle,
  getFontFamily,
  getShadow,
} from './styles';

// =============================================================================
// TRANSLATIONS
// =============================================================================

export {
  emailTranslations,
  getEmailTranslations,
  isRTL,
} from './translations';
export type {
  EmailLanguage,
  EmailTranslationSet,
  ConfirmationEmailStrings,
  PasswordResetEmailStrings,
  WelcomeEmailStrings,
  SubscriptionUpgradeStrings,
  SubscriptionCancelStrings,
  CommonStrings,
} from './translations';

// =============================================================================
// TEMPLATES
// =============================================================================

// Base template and components
export {
  baseEmailTemplate,
  primaryButton,
  secondaryButton,
  title,
  paragraph,
  mutedText,
  highlightBox,
  bulletList,
  divider,
  spacer,
} from './templates/base-template';
export type { BaseTemplateOptions } from './templates/base-template';

// Confirmation email
export {
  confirmationEmailTemplate,
  getConfirmationEmailSubject,
} from './templates/confirmation';
export type { ConfirmationEmailOptions } from './templates/confirmation';

// Password reset email
export {
  passwordResetEmailTemplate,
  getPasswordResetEmailSubject,
} from './templates/password-reset';
export type { PasswordResetEmailOptions } from './templates/password-reset';

// Welcome email
export {
  welcomeEmailTemplate,
  getWelcomeEmailSubject,
} from './templates/welcome';
export type { WelcomeEmailOptions } from './templates/welcome';

// Subscription upgrade email
export {
  subscriptionUpgradeEmailTemplate,
  getSubscriptionUpgradeEmailSubject,
} from './templates/subscription-upgrade';
export type { SubscriptionUpgradeEmailOptions } from './templates/subscription-upgrade';

// Subscription cancel email
export {
  subscriptionCancelEmailTemplate,
  getSubscriptionCancelEmailSubject,
} from './templates/subscription-cancel';
export type { SubscriptionCancelEmailOptions } from './templates/subscription-cancel';
