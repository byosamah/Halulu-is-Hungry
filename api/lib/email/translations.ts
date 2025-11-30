/**
 * Email Translations
 *
 * All email text strings in English and Arabic.
 * Each email type has its own section with all needed strings.
 *
 * Usage:
 *   const t = emailTranslations['en'].confirmation;
 *   console.log(t.title); // "Welcome to the food fam!"
 */

// =============================================================================
// TYPES
// =============================================================================

export type EmailLanguage = 'en' | 'ar';

export interface ConfirmationEmailStrings {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  buttonText: string;
  expiry: string;
  ignoreMessage: string;
}

export interface PasswordResetEmailStrings {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  buttonText: string;
  expiry: string;
  ignoreMessage: string;
  securityNote: string;
}

export interface WelcomeEmailStrings {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  features: string[];
  buttonText: string;
  closingText: string;
}

export interface SubscriptionUpgradeStrings {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  benefitsTitle: string;
  benefits: string[];
  buttonText: string;
  enjoyText: string;
}

export interface SubscriptionCancelStrings {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  accessUntilLabel: string;
  whatYouLose: string;
  lostFeatures: string[];
  buttonText: string;
  missYouText: string;
}

export interface CommonStrings {
  brandName: string;
  tagline: string;
  footerText: string;
  helpText: string;
  helpEmail: string;
  websiteUrl: string;
}

export interface EmailTranslationSet {
  common: CommonStrings;
  confirmation: ConfirmationEmailStrings;
  passwordReset: PasswordResetEmailStrings;
  welcome: WelcomeEmailStrings;
  subscriptionUpgrade: SubscriptionUpgradeStrings;
  subscriptionCancel: SubscriptionCancelStrings;
}

// =============================================================================
// ENGLISH TRANSLATIONS
// =============================================================================

const englishTranslations: EmailTranslationSet = {
  common: {
    brandName: 'Halulu',
    tagline: 'AI-Powered Restaurant Discovery',
    footerText: 'Built with love in Riyadh',
    helpText: 'Need help? Contact us at',
    helpEmail: 'eat@halulu.food',
    websiteUrl: 'https://www.halulu.food',
  },

  confirmation: {
    subject: 'Verify your email - Halulu',
    title: 'Welcome to the food fam! 🎉',
    greeting: 'Hey there, foodie!',
    body: "We're so excited to have you! Just one quick step - click the button below to verify your email address and start discovering amazing restaurants.",
    buttonText: 'Verify My Email',
    expiry: 'This link expires in 24 hours.',
    ignoreMessage:
      "If you didn't create an account with Halulu, you can safely ignore this email.",
  },

  passwordReset: {
    subject: 'Reset your password - Halulu',
    title: 'Reset your password 🔐',
    greeting: 'Hey there!',
    body: 'We received a request to reset your password. Click the button below to create a new password.',
    buttonText: 'Reset Password',
    expiry: 'This link expires in 1 hour.',
    ignoreMessage:
      "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
    securityNote:
      'For security reasons, this link can only be used once.',
  },

  welcome: {
    subject: "You're all set! Welcome to Halulu 🍕",
    title: "You're officially a foodie! 🎊",
    greeting: 'Welcome aboard!',
    body: "Your email is verified and you're ready to discover amazing restaurants. Here's what you can do:",
    features: [
      'Tell us what you\'re craving',
      'Get AI-powered recommendations based on real reviews',
      'Find hidden gems near you',
    ],
    buttonText: "Let's Find Food!",
    closingText: 'Happy eating! 🍜',
  },

  subscriptionUpgrade: {
    subject: "You're now a Pro member! 🌟",
    title: 'Welcome to Pro! 🚀',
    greeting: 'Congratulations!',
    body: "You've upgraded to Halulu Pro. Get ready for more delicious discoveries with your enhanced features.",
    benefitsTitle: "Here's what you get:",
    benefits: [
      '30 AI-powered searches per month',
      'Advanced AI model for better recommendations',
      'Priority support',
      'Early access to new features',
    ],
    buttonText: 'Start Searching',
    enjoyText: 'Enjoy your Pro experience!',
  },

  subscriptionCancel: {
    subject: 'Your subscription has been cancelled',
    title: "We're sad to see you go 😢",
    greeting: 'Hey there,',
    body: 'Your Halulu Pro subscription has been cancelled. You can still use your Pro features until your current period ends.',
    accessUntilLabel: 'Pro access until:',
    whatYouLose: "After that, you'll lose access to:",
    lostFeatures: [
      '30 searches per month (back to 3)',
      'Advanced AI model',
      'Priority support',
    ],
    buttonText: 'Reactivate Subscription',
    missYouText:
      "We'll miss you! You can reactivate anytime.",
  },
};

// =============================================================================
// ARABIC TRANSLATIONS (RTL)
// =============================================================================

const arabicTranslations: EmailTranslationSet = {
  common: {
    brandName: 'حلولو',
    tagline: 'اكتشاف المطاعم بالذكاء الاصطناعي',
    footerText: 'صُنع بحب في الرياض',
    helpText: 'تحتاج مساعدة؟ تواصل معنا على',
    helpEmail: 'eat@halulu.food',
    websiteUrl: 'https://www.halulu.food',
  },

  confirmation: {
    subject: 'تأكيد بريدك الإلكتروني - حلولو',
    title: 'أهلاً بك في عيلة الأكل! 🎉',
    greeting: 'أهلاً يا ذواق!',
    body: 'سعيدين جداً بانضمامك! خطوة واحدة سريعة - اضغط الزر أدناه لتأكيد بريدك الإلكتروني وابدأ باكتشاف أفضل المطاعم.',
    buttonText: 'تأكيد بريدي',
    expiry: 'هذا الرابط صالح لمدة ٢٤ ساعة.',
    ignoreMessage:
      'إذا لم تنشئ حساباً في حلولو، يمكنك تجاهل هذا البريد.',
  },

  passwordReset: {
    subject: 'إعادة تعيين كلمة المرور - حلولو',
    title: 'إعادة تعيين كلمة المرور 🔐',
    greeting: 'أهلاً!',
    body: 'استلمنا طلب لإعادة تعيين كلمة المرور. اضغط الزر أدناه لإنشاء كلمة مرور جديدة.',
    buttonText: 'إعادة تعيين كلمة المرور',
    expiry: 'هذا الرابط صالح لمدة ساعة واحدة.',
    ignoreMessage:
      'إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد. كلمة المرور ستبقى كما هي.',
    securityNote:
      'لأسباب أمنية، هذا الرابط يمكن استخدامه مرة واحدة فقط.',
  },

  welcome: {
    subject: 'كل شي جاهز! أهلاً بك في حلولو 🍕',
    title: 'صرت من عيلة الذواقين! 🎊',
    greeting: 'أهلاً وسهلاً!',
    body: 'تم تأكيد بريدك وأنت جاهز لاكتشاف مطاعم رهيبة. هذا اللي تقدر تسويه:',
    features: [
      'قلنا وش تشتهي',
      'احصل على توصيات ذكية مبنية على تقييمات حقيقية',
      'اكتشف أماكن مخفية قريبة منك',
    ],
    buttonText: 'يلا نلاقي أكل!',
    closingText: 'بالعافية! 🍜',
  },

  subscriptionUpgrade: {
    subject: 'أنت الحين عضو برو! 🌟',
    title: 'أهلاً بك في برو! 🚀',
    greeting: 'مبروك!',
    body: 'ترقيت لحلولو برو. استعد لاكتشافات ألذ مع مميزاتك المحسّنة.',
    benefitsTitle: 'هذا اللي تحصل عليه:',
    benefits: [
      '٣٠ بحث بالذكاء الاصطناعي شهرياً',
      'نموذج ذكاء اصطناعي متقدم لتوصيات أفضل',
      'دعم فني أولوية',
      'وصول مبكر للمميزات الجديدة',
    ],
    buttonText: 'ابدأ البحث',
    enjoyText: 'استمتع بتجربة برو!',
  },

  subscriptionCancel: {
    subject: 'تم إلغاء اشتراكك',
    title: 'بنشتاق لك 😢',
    greeting: 'أهلاً،',
    body: 'تم إلغاء اشتراك حلولو برو. تقدر تستخدم مميزات برو حتى نهاية الفترة الحالية.',
    accessUntilLabel: 'وصول برو حتى:',
    whatYouLose: 'بعدها، بتفقد الوصول لـ:',
    lostFeatures: [
      '٣٠ بحث شهرياً (ترجع لـ ٣)',
      'نموذج الذكاء الاصطناعي المتقدم',
      'الدعم الفني الأولوية',
    ],
    buttonText: 'إعادة تفعيل الاشتراك',
    missYouText:
      'بنشتاق لك! تقدر تعيد التفعيل في أي وقت.',
  },
};

// =============================================================================
// EXPORTS
// =============================================================================

export const emailTranslations: Record<EmailLanguage, EmailTranslationSet> = {
  en: englishTranslations,
  ar: arabicTranslations,
};

/**
 * Get translations for a specific language
 *
 * @param language - 'en' or 'ar'
 * @returns All email translations for that language
 */
export function getEmailTranslations(language: EmailLanguage): EmailTranslationSet {
  return emailTranslations[language] || emailTranslations.en;
}

/**
 * Check if a language is RTL (right-to-left)
 *
 * @param language - Language code
 * @returns True if RTL language
 */
export function isRTL(language: EmailLanguage): boolean {
  return language === 'ar';
}
