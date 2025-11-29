/**
 * ProfilePage.tsx
 *
 * User profile and settings page.
 *
 * Features:
 * - View account info (avatar, name, email)
 * - Subscription status (Free/Pro)
 * - Usage statistics
 * - Manage subscription (via Lemon Squeezy portal)
 * - Sign out
 * - RTL support
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Crown,
  Zap,
  Calendar,
  ExternalLink,
  LogOut,
  Mail,
  User,
  Sparkles,
  TrendingUp,
  Clock,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUsage, SEARCH_LIMITS } from '../contexts/UsageContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { getAvatarForUser } from '../lib/avatarUtils';
import { getRtlShadow } from '../utils/rtlShadow';

// ==================
// TYPES
// ==================

interface ProfileData {
  display_name: string | null;
  avatar_emoji: string;
  avatar_bg_color: string;
  is_premium: boolean;
  subscription_status: string | null;
  subscription_variant: string | null;
  subscription_ends_at: string | null;
  created_at: string;
}

// ==================
// COMPONENT
// ==================

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { usage, loading: usageLoading } = useUsage();
  const { t, isRTL } = useLanguage();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // Use defaults if profile not found
          const avatar = getAvatarForUser(user.id);
          setProfile({
            display_name: user.email?.split('@')[0] || 'User',
            avatar_emoji: avatar.emoji,
            avatar_bg_color: avatar.bgColor,
            is_premium: false,
            subscription_status: 'free',
            subscription_variant: null,
            subscription_ends_at: null,
            created_at: new Date().toISOString(),
          });
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Open Lemon Squeezy customer portal
  const openCustomerPortal = () => {
    // Lemon Squeezy customer portal URL
    // Users can manage their subscription here
    window.open('https://halulu.lemonsqueezy.com/billing', '_blank');
  };

  // Get avatar colors
  const getAvatarBgClass = (color: string) => {
    const colors: Record<string, string> = {
      coral: 'bg-brand-coral',
      teal: 'bg-brand-teal',
      yellow: 'bg-brand-yellow',
      pink: 'bg-brand-pink',
      purple: 'bg-brand-purple',
      green: 'bg-brand-green',
    };
    return colors[color] || 'bg-brand-coral';
  };

  // Format date (use Gregorian calendar for both languages)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🍕</div>
          <p className="font-body text-brand-muted">
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const avatar = profile
    ? { emoji: profile.avatar_emoji, bgColor: profile.avatar_bg_color }
    : getAvatarForUser(user.id);

  const isPremium = profile?.is_premium || false;
  const subscriptionStatus = profile?.subscription_status || 'free';

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-purple rounded-full opacity-[0.06] blur-[150px]" />
        <div className="absolute top-20 -right-40 w-[400px] h-[400px] bg-brand-coral rounded-full opacity-[0.05] blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-brand-teal rounded-full opacity-[0.04] blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b-2 border-brand-dark/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Back button (44px min touch target) - Bulletproof RTL pattern */}
          <button
            onClick={() => navigate('/app')}
            dir="ltr"
            className="flex items-center gap-2 text-brand-dark hover:text-brand-coral transition-colors p-2 -m-2 min-h-[44px]"
          >
            {isRTL ? (
              <>
                <span className="font-display" dir="auto">{t('back') as string}</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span className="font-display">{t('back') as string}</span>
              </>
            )}
          </button>

          {/* Title */}
          <h1 className="font-display text-xl font-bold text-brand-dark">
            {isRTL ? 'الملف الشخصي' : 'Profile'}
          </h1>

          {/* Spacer */}
          <div className="w-20" />
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-brand-dark mb-6"
          style={{ boxShadow: getRtlShadow('lg', isRTL, '#00CEC9') }}
        >
          {/* Avatar and basic info */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Large Avatar */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${getAvatarBgClass(avatar.bgColor)} flex items-center justify-center border-4 border-brand-dark`}
              style={{ boxShadow: getRtlShadow('md', isRTL) }}
            >
              <span className="text-4xl sm:text-5xl">{avatar.emoji}</span>
            </div>

            {/* Name and email */}
            <div className="flex-1">
              <h2
                className="font-display-black text-2xl sm:text-3xl text-brand-dark"
                style={isRTL ? { textAlign: 'right' } : undefined}
              >
                {profile?.display_name || user.email?.split('@')[0]}
              </h2>
              <div
                className="flex items-center gap-2 mt-1 w-fit"
                style={isRTL ? { marginLeft: 'auto' } : undefined}
              >
                <Mail className="w-4 h-4 text-brand-muted" />
                <span className="font-body text-brand-muted">{user.email}</span>
              </div>

              {/* Subscription badge */}
              <div
                className="mt-3 w-fit"
                style={isRTL ? { marginLeft: 'auto' } : undefined}
              >
                {isPremium ? (
                  <span className="inline-flex items-center gap-1.5 bg-brand-purple text-white px-3 py-1 rounded-full font-display text-sm">
                    <Crown className="w-4 h-4" />
                    Pro
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-brand-cream text-brand-dark px-3 py-1 rounded-full font-display text-sm border-2 border-brand-dark/20">
                    <Zap className="w-4 h-4" />
                    {isRTL ? 'مجاني' : 'Free'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Member since */}
          {profile?.created_at && (
            <div className="mt-6 pt-6 border-t-2 border-brand-dark/10 flex items-center gap-2 text-brand-muted">
              <Calendar className="w-4 h-4" />
              <span className="font-body text-sm">
                {isRTL ? 'عضو منذ' : 'Member since'} {formatDate(profile.created_at)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-brand-dark mb-6"
          style={{ boxShadow: getRtlShadow('lg', isRTL, isPremium ? '#A855F7' : '#FFD93D') }}
        >
          <h3 className="font-display-black text-xl text-brand-dark mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {isRTL ? 'الاشتراك' : 'Subscription'}
          </h3>

          {isPremium ? (
            <>
              {/* Premium status */}
              <div className="bg-brand-purple/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-brand-dark">
                      {isRTL ? 'خطة Pro' : 'Pro Plan'}
                      {profile?.subscription_variant && (
                        <span className={`text-brand-muted font-body text-sm ${isRTL ? 'mr-2' : 'ml-2'}`}>
                          ({profile.subscription_variant})
                        </span>
                      )}
                    </p>
                    <p className="font-body text-sm text-brand-muted mt-1">
                      {subscriptionStatus === 'cancelled' ? (
                        <>
                          {isRTL ? 'ملغى - ينتهي الوصول في' : 'Cancelled - Access until'}{' '}
                          {profile?.subscription_ends_at && formatDate(profile.subscription_ends_at)}
                        </>
                      ) : (
                        <>{isRTL ? 'نشط' : 'Active'}</>
                      )}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-brand-purple" />
                </div>
              </div>

              {/* Manage button (48px min touch target) */}
              <button
                onClick={openCustomerPortal}
                className="w-full py-3 px-4 min-h-[48px] bg-white text-brand-dark font-display rounded-xl border-3 border-brand-dark flex items-center justify-center gap-2 hover:bg-brand-cream transition-colors"
                style={{ boxShadow: getRtlShadow('sm', isRTL) }}
              >
                {isRTL ? 'إدارة الاشتراك' : 'Manage Subscription'}
                <ExternalLink className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* Pro Benefits - upgrade incentive */}
              <div className="mb-4">
                <p className="font-display text-sm text-brand-muted mb-3">
                  {isRTL ? 'ترقية عشان تحصل على:' : 'Upgrade to get:'}
                </p>
                <div className="space-y-2" dir={isRTL ? 'rtl' : 'ltr'}>
                  {[
                    { emoji: '🔍', bg: 'bg-brand-yellow/30', text: t('usage.benefit1') as string },
                    { emoji: '⭐', bg: 'bg-brand-coral/20', text: t('usage.benefit2') as string },
                    { emoji: '📍', bg: 'bg-brand-teal/20', text: t('usage.benefit3') as string },
                    { emoji: '🚀', bg: 'bg-brand-purple/20', text: t('usage.benefit4') as string },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-brand-cream rounded-xl p-3 border-2 border-brand-dark/20"
                    >
                      <span
                        className={`text-lg ${item.bg} p-2 rounded-lg border-2 border-brand-dark/10`}
                        style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
                      >
                        {item.emoji}
                      </span>
                      <span className="font-body-medium text-brand-dark text-sm">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade button (48px min touch target) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/pricing')}
                className="w-full py-3 px-4 min-h-[48px] bg-brand-coral text-white font-display rounded-xl border-3 border-brand-dark flex items-center justify-center gap-2"
                style={{ boxShadow: getRtlShadow('md', isRTL) }}
              >
                <Crown className="w-5 h-5" />
                {isRTL ? 'ترقية للأفضل' : 'Upgrade to Pro'}
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Usage Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-brand-dark mb-6"
          style={{ boxShadow: getRtlShadow('lg', isRTL, '#00CEC9') }}
        >
          <h3 className="font-display-black text-xl text-brand-dark mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isRTL ? 'إحصائيات الاستخدام' : 'Usage Statistics'}
          </h3>

          {usageLoading ? (
            <div className="animate-pulse h-24 bg-brand-cream rounded-xl" />
          ) : usage ? (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4">
              {/* Searches used */}
              <div className="bg-brand-cream rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-brand-purple" />
                  <span className="font-body text-sm text-brand-muted">
                    {isRTL ? 'عمليات البحث المستخدمة' : 'Searches Used'}
                  </span>
                </div>
                <p className="font-display-black text-3xl text-brand-dark">
                  {usage.searchCount}
                  <span className="text-lg text-brand-muted font-display">
                    /{usage.searchLimit}
                  </span>
                </p>
              </div>

              {/* Remaining */}
              <div className="bg-brand-cream rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-brand-green" />
                  <span className="font-body text-sm text-brand-muted">
                    {isRTL ? 'المتبقي' : 'Remaining'}
                  </span>
                </div>
                <p className="font-display-black text-3xl text-brand-dark">
                  {usage.remaining}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-brand-muted font-body">
              {isRTL ? 'لا توجد بيانات' : 'No data available'}
            </p>
          )}

          {/* Reset info */}
          {usage && (
            <div className="mt-4 pt-4 border-t-2 border-brand-dark/10 flex items-center gap-2 text-brand-muted">
              <Clock className="w-4 h-4" />
              <span className="font-body text-sm">
                {isRTL ? 'يتجدد في بداية الشهر القادم' : 'Resets at the start of next month'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Sign Out Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="w-full py-4 px-6 bg-white text-red-500 font-display rounded-xl border-3 border-red-300 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {t('auth.signOut') as string}
        </motion.button>
      </main>
    </div>
  );
};

export default ProfilePage;
