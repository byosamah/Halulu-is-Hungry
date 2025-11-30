/**
 * HeaderProfile Component
 *
 * User profile button that appears in the top right header.
 * Shows avatar with dropdown menu for profile actions.
 *
 * Features:
 * - Shows user's food emoji avatar
 * - Dropdown with profile options
 * - Sign out button
 * - RTL-aware positioning
 * - Neobrutalist design
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, ChevronDown, Globe, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUsage } from '../contexts/UsageContext';
import { getRtlShadow } from '../utils/rtlShadow';
import UserAvatar from './UserAvatar';
import { getAvatarForUser } from '../lib/avatarUtils';

const HeaderProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { usage } = useUsage();

  // Dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Avatar state - fetched from database or generated as fallback
  const [avatar, setAvatar] = useState<{ emoji: string; colorName: string } | null>(null);

  // Fetch avatar from database via API route (visible in Vercel logs)
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;

      try {
        // Call Vercel API route instead of Supabase directly
        const response = await fetch(`/api/profile?userId=${user.id}`);
        const data = await response.json();

        if (response.ok && data?.avatar_emoji && data?.avatar_bg_color) {
          // Use stored avatar from database
          setAvatar({
            emoji: data.avatar_emoji,
            colorName: data.avatar_bg_color,
          });
        } else {
          // Fallback: use consistent algorithm from avatarUtils
          // This uses ALL characters of user ID for consistency
          const fallbackAvatar = getAvatarForUser(user.id);
          setAvatar({
            emoji: fallbackAvatar.emoji,
            colorName: fallbackAvatar.bgColor, // bgColor maps to colorName
          });
        }
      } catch {
        // On error, use fallback avatar
        const fallbackAvatar = getAvatarForUser(user.id);
        setAvatar({
          emoji: fallbackAvatar.emoji,
          colorName: fallbackAvatar.bgColor,
        });
      }
    };

    fetchAvatar();
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/');
  };

  // Get user display name (email or name from Google)
  // Use translated fallback for "User" when no name is available
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || (isRTL ? 'مستخدم' : 'User');
  const userEmail = user?.email || '';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/50 transition-colors"
        aria-label={t('auth.profile') as string || (isRTL ? 'قائمة الملف الشخصي' : 'Profile menu')}
        aria-expanded={isOpen}
      >
        <UserAvatar
          emoji={avatar?.emoji || '🍽️'}
          colorName={avatar?.colorName || 'yellow'}
          size="md"
        />
        <ChevronDown
          className={`w-4 h-4 text-brand-dark transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 w-72 bg-white border-3 border-brand-dark rounded-xl overflow-hidden z-50 ${
              isRTL ? 'right-0' : 'right-0'
            }`}
            style={{ boxShadow: getRtlShadow('md', isRTL) }}
          >
            {/* User Info Header */}
            <div className="p-4 border-b-2 border-brand-dark/10 bg-brand-cream/50">
              <div className="flex items-center gap-3">
                <UserAvatar
                  emoji={avatar?.emoji || '🍽️'}
                  colorName={avatar?.colorName || 'yellow'}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display text-brand-dark truncate"
                    dir="ltr"
                    style={isRTL ? { textAlign: 'right' } : undefined}
                  >
                    {displayName}
                  </p>
                  <p
                    className="font-body text-sm text-brand-muted truncate"
                    dir="ltr"
                    style={isRTL ? { textAlign: 'right' } : undefined}
                  >
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Profile Link */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-brand-dark hover:bg-brand-cream transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{t('auth.myProfile') as string}</span>
              </button>

              {/* Upgrade Button - Only for free users */}
              {!usage?.isPremium && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/pricing');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl font-display text-white bg-brand-coral border-2 border-brand-dark hover:-translate-y-0.5 transition-all"
                  style={{ boxShadow: getRtlShadow('xs', isRTL) }}
                >
                  <Crown className="w-5 h-5" />
                  <span>{isRTL ? 'ترقية للأفضل' : 'Upgrade to Pro'}</span>
                </button>
              )}

              {/* Language Toggle */}
              <div className="border-t border-brand-dark/10 my-2 pt-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Globe className="w-5 h-5 text-brand-muted" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1.5 rounded-lg font-body text-sm border-2 transition-colors ${
                        language === 'en'
                          ? 'bg-brand-coral text-white border-brand-dark'
                          : 'bg-white text-brand-dark border-brand-dark/20 hover:border-brand-dark'
                      }`}
                    >
                      🇺🇸 EN
                    </button>
                    <button
                      onClick={() => setLanguage('ar')}
                      className={`px-3 py-1.5 rounded-lg font-body text-sm border-2 transition-colors ${
                        language === 'ar'
                          ? 'bg-brand-coral text-white border-brand-dark'
                          : 'bg-white text-brand-dark border-brand-dark/20 hover:border-brand-dark'
                      }`}
                    >
                      🇸🇦 ع
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('auth.signOut') as string || (isRTL ? 'تسجيل الخروج' : 'Sign Out')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderProfile;
