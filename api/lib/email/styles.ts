/**
 * Email Design Tokens
 *
 * These are the neobrutalist design tokens converted to inline CSS
 * for email compatibility. Emails don't support CSS variables or
 * external stylesheets, so everything must be inline.
 *
 * Based on the Halulu brand design system from index.css
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const EMAIL_COLORS = {
  // Primary brand colors
  coral: '#FF6B6B',      // Primary - buttons, CTAs, highlights
  teal: '#00CEC9',       // Secondary - shadows, accents
  yellow: '#FFD93D',     // Accent - highlights, warnings

  // Neutral colors
  dark: '#1a1a2e',       // Text, borders (near black)
  cream: '#FFF8F0',      // Background
  white: '#FFFFFF',      // Pure white

  // Supporting colors
  muted: '#6B7280',      // Secondary text, footers
  lightGray: '#F3F4F6',  // Subtle backgrounds

  // Status colors
  purple: '#A855F7',     // Premium/Pro accent
  green: '#00B894',      // Success states
  pink: '#FD79A8',       // Playful accent
};

// =============================================================================
// NEOBRUTALIST STYLES
// =============================================================================

export const EMAIL_STYLES = {
  // Borders - the signature neobrutalist look
  border: `3px solid ${EMAIL_COLORS.dark}`,
  borderThin: `2px solid ${EMAIL_COLORS.dark}`,
  borderThick: `4px solid ${EMAIL_COLORS.dark}`,

  // Shadows - hard edge, no blur (LTR direction)
  shadowSmallLTR: `3px 3px 0px 0px ${EMAIL_COLORS.dark}`,
  shadowMediumLTR: `4px 4px 0px 0px ${EMAIL_COLORS.teal}`,
  shadowLargeLTR: `6px 6px 0px 0px ${EMAIL_COLORS.teal}`,

  // Shadows - RTL direction (flipped for Arabic)
  shadowSmallRTL: `-3px 3px 0px 0px ${EMAIL_COLORS.dark}`,
  shadowMediumRTL: `-4px 4px 0px 0px ${EMAIL_COLORS.teal}`,
  shadowLargeRTL: `-6px 6px 0px 0px ${EMAIL_COLORS.teal}`,

  // Button shadows
  buttonShadowLTR: `4px 4px 0px 0px ${EMAIL_COLORS.dark}`,
  buttonShadowRTL: `-4px 4px 0px 0px ${EMAIL_COLORS.dark}`,

  // Border radius
  borderRadius: '12px',
  borderRadiusSmall: '8px',
  borderRadiusLarge: '16px',

  // Typography - web-safe fonts that work in all email clients
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontFamilyArabic: 'Tahoma, Arial, sans-serif',

  // Font sizes
  fontSizeHero: '32px',
  fontSizeTitle: '24px',
  fontSizeBody: '16px',
  fontSizeSmall: '14px',
  fontSizeTiny: '12px',

  // Line heights
  lineHeightTight: '1.2',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.6',

  // Spacing (for padding/margins)
  spacingXs: '8px',
  spacingSm: '12px',
  spacingMd: '16px',
  spacingLg: '24px',
  spacingXl: '32px',
  spacing2xl: '48px',
};

// =============================================================================
// BUTTON STYLES
// =============================================================================

/**
 * Generate inline styles for the primary CTA button
 * This is the coral button with dark border and shadow
 */
export function getPrimaryButtonStyle(isRTL: boolean = false): string {
  return `
    display: inline-block;
    background-color: ${EMAIL_COLORS.coral};
    color: ${EMAIL_COLORS.white};
    font-family: ${isRTL ? EMAIL_STYLES.fontFamilyArabic : EMAIL_STYLES.fontFamily};
    font-size: ${EMAIL_STYLES.fontSizeBody};
    font-weight: 700;
    text-decoration: none;
    padding: 14px 28px;
    border: ${EMAIL_STYLES.border};
    border-radius: ${EMAIL_STYLES.borderRadius};
    box-shadow: ${isRTL ? EMAIL_STYLES.buttonShadowRTL : EMAIL_STYLES.buttonShadowLTR};
    text-align: center;
  `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate inline styles for the secondary button
 * This is the white button with dark border
 */
export function getSecondaryButtonStyle(isRTL: boolean = false): string {
  return `
    display: inline-block;
    background-color: ${EMAIL_COLORS.white};
    color: ${EMAIL_COLORS.dark};
    font-family: ${isRTL ? EMAIL_STYLES.fontFamilyArabic : EMAIL_STYLES.fontFamily};
    font-size: ${EMAIL_STYLES.fontSizeBody};
    font-weight: 600;
    text-decoration: none;
    padding: 12px 24px;
    border: ${EMAIL_STYLES.borderThin};
    border-radius: ${EMAIL_STYLES.borderRadius};
    text-align: center;
  `.replace(/\s+/g, ' ').trim();
}

// =============================================================================
// CONTAINER STYLES
// =============================================================================

/**
 * Main email container style
 * Max width 600px is standard for email
 */
export const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  background-color: ${EMAIL_COLORS.white};
  font-family: ${EMAIL_STYLES.fontFamily};
`.replace(/\s+/g, ' ').trim();

/**
 * Header section style (cream background with logo)
 */
export const headerStyle = `
  background-color: ${EMAIL_COLORS.cream};
  padding: ${EMAIL_STYLES.spacingLg};
  text-align: center;
  border-bottom: ${EMAIL_STYLES.borderThin};
`.replace(/\s+/g, ' ').trim();

/**
 * Main content section style
 */
export const contentStyle = `
  padding: ${EMAIL_STYLES.spacingXl};
  background-color: ${EMAIL_COLORS.white};
`.replace(/\s+/g, ' ').trim();

/**
 * Footer section style
 */
export const footerStyle = `
  background-color: ${EMAIL_COLORS.cream};
  padding: ${EMAIL_STYLES.spacingLg};
  text-align: center;
  border-top: ${EMAIL_STYLES.borderThin};
`.replace(/\s+/g, ' ').trim();

/**
 * Highlighted box style (for important info)
 * Uses the yellow accent color
 */
export function getHighlightBoxStyle(isRTL: boolean = false): string {
  return `
    background-color: ${EMAIL_COLORS.yellow};
    border: ${EMAIL_STYLES.borderThin};
    border-radius: ${EMAIL_STYLES.borderRadiusSmall};
    padding: ${EMAIL_STYLES.spacingMd};
    margin: ${EMAIL_STYLES.spacingMd} 0;
    box-shadow: ${isRTL ? EMAIL_STYLES.shadowSmallRTL : EMAIL_STYLES.shadowSmallLTR};
  `.replace(/\s+/g, ' ').trim();
}

// =============================================================================
// TEXT STYLES
// =============================================================================

export const titleStyle = `
  color: ${EMAIL_COLORS.dark};
  font-size: ${EMAIL_STYLES.fontSizeTitle};
  font-weight: 700;
  line-height: ${EMAIL_STYLES.lineHeightTight};
  margin: 0 0 ${EMAIL_STYLES.spacingMd} 0;
`.replace(/\s+/g, ' ').trim();

export const bodyTextStyle = `
  color: ${EMAIL_COLORS.dark};
  font-size: ${EMAIL_STYLES.fontSizeBody};
  line-height: ${EMAIL_STYLES.lineHeightRelaxed};
  margin: 0 0 ${EMAIL_STYLES.spacingMd} 0;
`.replace(/\s+/g, ' ').trim();

export const mutedTextStyle = `
  color: ${EMAIL_COLORS.muted};
  font-size: ${EMAIL_STYLES.fontSizeSmall};
  line-height: ${EMAIL_STYLES.lineHeightNormal};
  margin: 0;
`.replace(/\s+/g, ' ').trim();

export const linkStyle = `
  color: ${EMAIL_COLORS.coral};
  text-decoration: underline;
`.replace(/\s+/g, ' ').trim();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the correct font family based on language
 */
export function getFontFamily(isRTL: boolean): string {
  return isRTL ? EMAIL_STYLES.fontFamilyArabic : EMAIL_STYLES.fontFamily;
}

/**
 * Get shadow based on direction
 */
export function getShadow(size: 'small' | 'medium' | 'large', isRTL: boolean): string {
  const shadows = {
    small: isRTL ? EMAIL_STYLES.shadowSmallRTL : EMAIL_STYLES.shadowSmallLTR,
    medium: isRTL ? EMAIL_STYLES.shadowMediumRTL : EMAIL_STYLES.shadowMediumLTR,
    large: isRTL ? EMAIL_STYLES.shadowLargeRTL : EMAIL_STYLES.shadowLargeLTR,
  };
  return shadows[size];
}
