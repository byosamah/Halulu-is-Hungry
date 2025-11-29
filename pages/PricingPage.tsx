/**
 * PricingPage.tsx
 *
 * Dedicated pricing page with Lemon Squeezy checkout integration.
 * Users can choose between Monthly ($5) and Yearly ($48) plans.
 *
 * Features:
 * - Neobrutalist design matching the app
 * - Lemon Squeezy checkout overlay
 * - Pre-fills user email if logged in
 * - Passes user_id in custom_data for webhook matching
 * - RTL support
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Zap, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getRtlShadow } from '../utils/rtlShadow';

// ==================
// LEMON SQUEEZY CONFIG
// ==================
// Product UUIDs from Lemon Squeezy (found in the /buy/ URL)
const LEMON_SQUEEZY_CONFIG = {
  // Your store slug (e.g., "halulu" if your checkout URL is halulu.lemonsqueezy.com)
  storeSlug: import.meta.env.VITE_LEMON_SQUEEZY_STORE_SLUG || 'your-store',
  // Product UUIDs for each plan (from the /buy/{uuid} URL)
  monthlyUuid: import.meta.env.VITE_LEMON_SQUEEZY_MONTHLY_UUID || '',
  yearlyUuid: import.meta.env.VITE_LEMON_SQUEEZY_YEARLY_UUID || '',
};

// ==================
// TYPES
// ==================

interface Plan {
  id: 'monthly' | 'yearly';
  name: string;
  nameAr: string;
  price: string;
  oldPrice?: string;
  period: string;
  periodAr: string;
  monthlyEquiv?: string;
  monthlyEquivAr?: string;
  badge?: string;
  badgeAr?: string;
  features: string[];
  featuresAr: string[];
  productUuid: string;
  popular?: boolean;
}

// ==================
// PLANS DATA
// ==================

const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    nameAr: 'شهري',
    price: '$4.99',
    period: '/month',
    periodAr: '/شهر',
    badge: '1 Day Free Trial',
    badgeAr: 'تجربة مجانية يوم',
    features: [
      '50 AI-powered searches',
      'Accurate reading & analysis of reviews',
      'Location-based results',
    ],
    featuresAr: [
      '50 بحث ذكي',
      'قراءة دقيقة وتحليل للتقييمات',
      'نتائج حسب موقعك',
    ],
    productUuid: LEMON_SQUEEZY_CONFIG.monthlyUuid,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    nameAr: 'سنوي',
    price: '$4.99',
    oldPrice: '$99',
    period: '/year',
    periodAr: '/سنة',
    monthlyEquiv: '',
    monthlyEquivAr: '',
    badge: 'Save 95%',
    badgeAr: 'وفر 95%',
    features: [
      '600 AI-powered searches (50/month)',
      'More advanced AI model',
      'Accurate reading & analysis of reviews',
      'Location-based results',
    ],
    featuresAr: [
      '600 بحث ذكي (50 بحث شهريًا)',
      'نموذج ذكاء اصطناعي متقدم أكثر',
      'قراءة دقيقة وتحليل للتقييمات',
      'نتائج حسب موقعك',
    ],
    productUuid: LEMON_SQUEEZY_CONFIG.yearlyUuid,
    popular: true,
  },
];

// ==================
// COMPONENT
// ==================

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  // ==================
  // CHECKOUT HANDLER
  // ==================
  const handleCheckout = (plan: Plan) => {
    // Build checkout URL with pre-filled data
    // Using the /buy/{uuid} format (not /checkout/buy/{variant_id})
    const baseUrl = `https://${LEMON_SQUEEZY_CONFIG.storeSlug}.lemonsqueezy.com/buy/${plan.productUuid}`;

    // Build query params
    const params = new URLSearchParams();

    // Pre-fill email if user is logged in
    if (user?.email) {
      params.set('checkout[email]', user.email);
    }

    // Pass user_id in custom_data for webhook matching
    // This is CRITICAL - webhooks will use this to update the right user
    if (user?.id) {
      params.set('checkout[custom][user_id]', user.id);
    }

    // Enable dark mode to match our design
    params.set('embed', '1'); // For overlay mode

    const checkoutUrl = `${baseUrl}?${params.toString()}`;

    // Try to use Lemon.js overlay (better UX)
    // Falls back to redirect if Lemon.js not loaded
    if ((window as any).LemonSqueezy) {
      (window as any).LemonSqueezy.Url.Open(checkoutUrl);
    } else {
      // Fallback: open in new tab
      window.open(checkoutUrl, '_blank');
    }
  };

  // ==================
  // RENDER
  // ==================
  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-coral rounded-full opacity-[0.06] blur-[150px]" />
        <div className="absolute top-20 -right-40 w-[400px] h-[400px] bg-brand-teal rounded-full opacity-[0.05] blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-brand-purple rounded-full opacity-[0.04] blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b-2 border-brand-dark/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Back button (44px min touch target) */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brand-dark hover:text-brand-coral transition-colors p-2 -m-2 min-h-[44px]"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="font-display">{t('back') as string}</span>
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <svg className="w-7 h-7" viewBox="0 0 182.59 194.77" fill="currentColor">
              <path d="M69.46,5.75v35.25c-7.33,1.12-13.99.31-20.95-2.05l-.17-33.08c-2.1-6.84-11.22-7.28-13.36-.09l-.11,32.64c-6.61,3.06-13.72,3.67-20.92,2.58V6.25c0-.76-1.51-3.13-2.25-3.75C7.01-1.45,1.11,1.03,0,6.79l.02,86.9c1.5,13.63,12.86,24.26,26.62,24.38l.69.66-5.37,61.52c1.04,13.38,12.56,15.06,23.77,14.27,11.82-.83,16.31-7.73,15.22-19.27l-5-57.25c13.69-.08,24.73-9.93,26.95-23.3l.02-89.42c-1.59-7.22-12.28-6.68-13.47.47Z"/>
              <path d="M181.95,42.26c-1.63-19.9-22.2-42.26-42.74-42.26h-26.25v183.25c0,6.45,8.81,10.69,14.31,11.19,13.43,1.22,26.16-.22,25.71-16.71l-5.47-59.41c5.97-3.04,12.65-5.19,18.19-9.33,8.24-6.16,15.16-18,16.2-28.3.97-9.7.86-28.62.05-38.43Z"/>
            </svg>
            <h1 className="font-display text-xl font-bold text-brand-dark">
              {t('brandName') as string}
            </h1>
          </button>

          {/* Spacer for alignment */}
          <div className="w-20" />
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-10">
        {/* Title section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-yellow/20 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-brand-yellow" />
            <span className="font-display text-brand-dark">
              {isRTL ? 'ترقية للأفضل' : 'Upgrade to Pro'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display-black text-4xl sm:text-5xl lg:text-6xl text-brand-dark mb-4"
          >
            {t('pricingTitle') as string}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-brand-muted max-w-xl mx-auto"
          >
            {t('pricingSubtitle') as string}
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div className="flex justify-center gap-6 lg:gap-8">
          {plans.filter(plan => plan.popular).map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`
                relative bg-white rounded-3xl p-5 sm:p-8 border-4 border-brand-dark
                w-full max-w-md text-center
                ${plan.popular ? 'ring-4 ring-brand-coral/30' : ''}
              `}
              style={{ boxShadow: getRtlShadow('lg', isRTL, plan.popular ? '#FF6B6B' : '#00CEC9') }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-brand-coral text-white px-4 py-1.5 rounded-full font-display text-sm flex items-center gap-1.5 whitespace-nowrap">
                    <Crown className="w-4 h-4" />
                    {isRTL ? 'العرض لأول 100 مشترك فقط' : 'First 100 subscribers only'}
                  </div>
                </div>
              )}

              {/* Plan badge */}
              {plan.badge && (
                <div className="inline-block bg-brand-yellow/20 text-brand-dark px-3 py-1 rounded-lg font-display text-sm mb-4">
                  {isRTL ? plan.badgeAr : plan.badge}
                </div>
              )}

              {/* Plan name */}
              <h2 className="font-display-black text-2xl text-brand-dark mb-2">
                {isRTL ? plan.nameAr : plan.name}
              </h2>

              {/* Price */}
              {plan.oldPrice && (
                <p className="font-display text-xl text-brand-muted line-through mb-1">
                  {plan.oldPrice}
                </p>
              )}
              <div className="flex items-baseline gap-1 mb-2 justify-center">
                <span className="font-display-black text-5xl text-brand-dark">
                  {plan.price}
                </span>
                <span className="font-body text-brand-muted text-lg">
                  {isRTL ? plan.periodAr : plan.period}
                </span>
              </div>

              {/* Monthly equivalent for yearly */}
              {(isRTL ? plan.monthlyEquivAr : plan.monthlyEquiv) && (
                <p className="font-body text-sm text-brand-muted mb-6">
                  {isRTL ? plan.monthlyEquivAr : plan.monthlyEquiv}
                </p>
              )}

              {/* Features */}
              <div className="space-y-3 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
                {(isRTL ? plan.featuresAr : plan.features).map((feature, i) => {
                  // Emoji and color for each feature
                  const featureStyles = [
                    { emoji: '🔍', bg: 'bg-brand-yellow/30' },
                    { emoji: '⭐', bg: 'bg-brand-coral/20' },
                    { emoji: '📍', bg: 'bg-brand-teal/20' },
                    { emoji: '🚀', bg: 'bg-brand-purple/20' },
                  ];
                  const style = featureStyles[i % featureStyles.length];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20"
                    >
                      <span
                        className={`text-xl ${style.bg} p-2 rounded-lg border-2 border-brand-dark/10`}
                        style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
                      >
                        {style.emoji}
                      </span>
                      <span className="font-body-medium text-brand-dark text-sm">{feature}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCheckout(plan)}
                disabled={!plan.productUuid}
                className={`
                  w-full py-4 px-6 rounded-xl font-display text-lg
                  border-3 border-brand-dark flex items-center justify-center gap-2
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${plan.popular
                    ? 'bg-brand-coral text-white hover:bg-brand-coral/90'
                    : 'bg-white text-brand-dark hover:bg-brand-cream'
                  }
                `}
                style={{ boxShadow: getRtlShadow('md', isRTL) }}
              >
                {plan.popular && <Crown className="w-5 h-5" />}
                {!plan.popular && <Zap className="w-5 h-5" />}
                {plan.id === 'monthly'
                  ? (t('monthlyCtaBtn') as string)
                  : (t('yearlyCtaBtn') as string)
                }
              </motion.button>

              {/* Not configured warning */}
              {!plan.productUuid && (
                <p className="text-center text-xs text-brand-muted mt-3">
                  ⚠️ Configure VITE_LEMON_SQUEEZY_{plan.id.toUpperCase()}_UUID
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Secure checkout badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-6 text-brand-muted"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-body text-sm">
            {isRTL ? 'دفع آمن عبر Lemon Squeezy' : 'Secure checkout via Lemon Squeezy'}
          </span>
        </motion.div>
      </main>
    </div>
  );
};

export default PricingPage;
