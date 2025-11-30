/**
 * Base Email Template
 *
 * This is the HTML wrapper that all emails use. It provides:
 * - Table-based layout for email client compatibility
 * - RTL support for Arabic
 * - Neobrutalist header with logo
 * - Footer with brand info
 *
 * Usage:
 *   const html = baseEmailTemplate({
 *     language: 'en',
 *     content: '<h1>Hello!</h1><p>Your content here</p>',
 *   });
 */

import {
  EMAIL_COLORS,
  EMAIL_STYLES,
  getFontFamily,
  getShadow,
} from '../styles.js';
import { getEmailTranslations, isRTL as checkIsRTL, type EmailLanguage } from '../translations.js';

// =============================================================================
// TYPES
// =============================================================================

export interface BaseTemplateOptions {
  /** Language for the email ('en' or 'ar') */
  language: EmailLanguage;

  /** The main content HTML to insert */
  content: string;

  /** Optional preview text (shows in inbox before opening) */
  previewText?: string;
}

// =============================================================================
// MAIN TEMPLATE FUNCTION
// =============================================================================

/**
 * Generate the base HTML email structure
 *
 * @param options - Template options
 * @returns Complete HTML string for the email
 */
export function baseEmailTemplate(options: BaseTemplateOptions): string {
  const { language, content, previewText } = options;

  const isRTL = checkIsRTL(language);
  const t = getEmailTranslations(language);
  const direction = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';
  const fontFamily = getFontFamily(isRTL);

  // The shadow flips direction for RTL
  const logoShadow = getShadow('medium', isRTL);

  return `
<!DOCTYPE html>
<html lang="${language}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${t.common.brandName}</title>

  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <style>
    /* Reset styles for email clients */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: ${EMAIL_COLORS.cream};
    }

    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      .content-padding {
        padding: 24px 16px !important;
      }
      .button-full-width {
        width: 100% !important;
        display: block !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${EMAIL_COLORS.cream}; font-family: ${fontFamily};">

  ${previewText ? `
  <!-- Preview text (hidden) -->
  <div style="display: none; font-size: 1px; color: ${EMAIL_COLORS.cream}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${previewText}
  </div>
  ` : ''}

  <!-- Background wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${EMAIL_COLORS.cream};">
    <tr>
      <td align="center" style="padding: 24px 16px;">

        <!-- Main email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: ${EMAIL_COLORS.white}; border: ${EMAIL_STYLES.border}; border-radius: ${EMAIL_STYLES.borderRadiusLarge}; box-shadow: ${logoShadow}; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: ${EMAIL_COLORS.cream}; padding: 24px; text-align: center; border-bottom: ${EMAIL_STYLES.borderThin};">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <!-- Logo / Brand name -->
                    <div style="display: inline-block; background-color: ${EMAIL_COLORS.coral}; color: ${EMAIL_COLORS.white}; font-family: ${fontFamily}; font-size: 28px; font-weight: 700; padding: 12px 24px; border: ${EMAIL_STYLES.borderThin}; border-radius: ${EMAIL_STYLES.borderRadius}; box-shadow: ${getShadow('small', isRTL)};">
                      ${isRTL ? '🍕 حلولو' : '🍕 Halulu'}
                    </div>
                    <p style="margin: 12px 0 0 0; color: ${EMAIL_COLORS.muted}; font-size: ${EMAIL_STYLES.fontSizeSmall}; font-family: ${fontFamily};">
                      ${t.common.tagline}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content-padding" style="padding: 32px; text-align: ${textAlign}; font-family: ${fontFamily}; direction: ${direction};">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${EMAIL_COLORS.cream}; padding: 24px; text-align: center; border-top: ${EMAIL_STYLES.borderThin};">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: ${EMAIL_COLORS.muted}; font-size: ${EMAIL_STYLES.fontSizeTiny}; font-family: ${fontFamily};">
                      ${t.common.footerText}
                    </p>
                    <p style="margin: 0 0 8px 0; color: ${EMAIL_COLORS.muted}; font-size: ${EMAIL_STYLES.fontSizeTiny}; font-family: ${fontFamily};">
                      ${t.common.helpText}
                      <a href="mailto:${t.common.helpEmail}" style="color: ${EMAIL_COLORS.coral}; text-decoration: none;">${t.common.helpEmail}</a>
                    </p>
                    <p style="margin: 0; color: ${EMAIL_COLORS.muted}; font-size: ${EMAIL_STYLES.fontSizeTiny}; font-family: ${fontFamily};">
                      <a href="${t.common.websiteUrl}" style="color: ${EMAIL_COLORS.coral}; text-decoration: none;">halulu.food</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End main container -->

      </td>
    </tr>
  </table>
  <!-- End background wrapper -->

</body>
</html>
  `.trim();
}

// =============================================================================
// CONTENT HELPER COMPONENTS
// =============================================================================

/**
 * Generate a primary CTA button
 *
 * @param text - Button text
 * @param url - Button link URL
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for the button
 */
export function primaryButton(text: string, url: string, isRTL: boolean = false): string {
  const shadow = getShadow('small', isRTL);
  const fontFamily = getFontFamily(isRTL);

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${url}" target="_blank" class="button-full-width" style="display: inline-block; background-color: ${EMAIL_COLORS.coral}; color: ${EMAIL_COLORS.white}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeBody}; font-weight: 700; text-decoration: none; padding: 16px 32px; border: ${EMAIL_STYLES.border}; border-radius: ${EMAIL_STYLES.borderRadius}; box-shadow: ${shadow};">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `.trim();
}

/**
 * Generate a secondary button
 *
 * @param text - Button text
 * @param url - Button link URL
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for the button
 */
export function secondaryButton(text: string, url: string, isRTL: boolean = false): string {
  const fontFamily = getFontFamily(isRTL);

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0;">
      <tr>
        <td align="center">
          <a href="${url}" target="_blank" style="display: inline-block; background-color: ${EMAIL_COLORS.white}; color: ${EMAIL_COLORS.dark}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeBody}; font-weight: 600; text-decoration: none; padding: 12px 24px; border: ${EMAIL_STYLES.borderThin}; border-radius: ${EMAIL_STYLES.borderRadius};">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `.trim();
}

/**
 * Generate a title/heading
 *
 * @param text - Title text
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for the title
 */
export function title(text: string, isRTL: boolean = false): string {
  const fontFamily = getFontFamily(isRTL);
  const textAlign = isRTL ? 'right' : 'left';

  return `
    <h1 style="margin: 0 0 16px 0; color: ${EMAIL_COLORS.dark}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeTitle}; font-weight: 700; line-height: ${EMAIL_STYLES.lineHeightTight}; text-align: ${textAlign};">
      ${text}
    </h1>
  `.trim();
}

/**
 * Generate body text paragraph
 *
 * @param text - Paragraph text
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for the paragraph
 */
export function paragraph(text: string, isRTL: boolean = false): string {
  const fontFamily = getFontFamily(isRTL);
  const textAlign = isRTL ? 'right' : 'left';

  return `
    <p style="margin: 0 0 16px 0; color: ${EMAIL_COLORS.dark}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeBody}; line-height: ${EMAIL_STYLES.lineHeightRelaxed}; text-align: ${textAlign};">
      ${text}
    </p>
  `.trim();
}

/**
 * Generate muted/small text
 *
 * @param text - Text content
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for muted text
 */
export function mutedText(text: string, isRTL: boolean = false): string {
  const fontFamily = getFontFamily(isRTL);
  const textAlign = isRTL ? 'right' : 'left';

  return `
    <p style="margin: 16px 0 0 0; color: ${EMAIL_COLORS.muted}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeSmall}; line-height: ${EMAIL_STYLES.lineHeightNormal}; text-align: ${textAlign};">
      ${text}
    </p>
  `.trim();
}

/**
 * Generate a highlighted info box (yellow background)
 *
 * @param content - Box content HTML
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for the box
 */
export function highlightBox(content: string, isRTL: boolean = false): string {
  const shadow = getShadow('small', isRTL);
  const fontFamily = getFontFamily(isRTL);
  const textAlign = isRTL ? 'right' : 'left';

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 16px 0;">
      <tr>
        <td style="background-color: ${EMAIL_COLORS.yellow}; border: ${EMAIL_STYLES.borderThin}; border-radius: ${EMAIL_STYLES.borderRadiusSmall}; padding: 16px; box-shadow: ${shadow}; font-family: ${fontFamily}; text-align: ${textAlign};">
          ${content}
        </td>
      </tr>
    </table>
  `.trim();
}

/**
 * Generate a bulleted list
 *
 * @param items - Array of list item strings
 * @param isRTL - Whether the layout is RTL
 * @returns HTML string for the list
 */
export function bulletList(items: string[], isRTL: boolean = false): string {
  const fontFamily = getFontFamily(isRTL);
  const textAlign = isRTL ? 'right' : 'left';
  const paddingDir = isRTL ? 'padding-right' : 'padding-left';

  const listItems = items
    .map(
      (item) => `
      <li style="margin: 8px 0; color: ${EMAIL_COLORS.dark}; font-family: ${fontFamily}; font-size: ${EMAIL_STYLES.fontSizeBody}; line-height: ${EMAIL_STYLES.lineHeightRelaxed};">
        ${item}
      </li>
    `
    )
    .join('');

  return `
    <ul style="margin: 16px 0; ${paddingDir}: 24px; text-align: ${textAlign};">
      ${listItems}
    </ul>
  `.trim();
}

/**
 * Generate a divider line
 *
 * @returns HTML string for a divider
 */
export function divider(): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="border-top: 1px solid ${EMAIL_COLORS.lightGray};"></td>
      </tr>
    </table>
  `.trim();
}

/**
 * Generate a spacer
 *
 * @param height - Height in pixels (default 24)
 * @returns HTML string for spacer
 */
export function spacer(height: number = 24): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</td>
      </tr>
    </table>
  `.trim();
}
