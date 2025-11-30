/**
 * ResetPasswordPage.tsx
 *
 * Page where users set their new password after clicking the reset link in email.
 *
 * How it works:
 * 1. User clicks reset link in email
 * 2. Supabase handles the token and creates a recovery session
 * 3. User lands on this page with an active session
 * 4. User enters new password
 * 5. We call updatePassword() from AuthContext
 * 6. User is redirected to sign in page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getRtlShadow } from '../utils/rtlShadow';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { updatePassword, session } = useAuth();

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user has a valid recovery session
  useEffect(() => {
    // If no session, the reset link might be invalid or expired
    // Supabase handles the token automatically and creates a session
    // We'll show an error if they try to submit without a session
  }, [session]);

  // Handle password update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      setError(t('auth.errorEmptyFields') as string);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.errorPasswordMismatch') as string);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError(t('auth.errorPasswordTooShort') as string);
      setLoading(false);
      return;
    }

    // Check if user has a valid session (from the recovery link)
    if (!session) {
      setError(t('auth.errorInvalidResetLink') as string);
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await updatePassword(newPassword);

      if (updateError) {
        setError(updateError.message);
      } else {
        // Show success and redirect after a short delay
        setSuccess(t('auth.passwordUpdated') as string);
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (err) {
      setError(t('auth.errorGeneric') as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream overflow-hidden relative">
      {/* ===== BACKGROUND BLOBS ===== */}
      <div
        className="absolute overflow-hidden pointer-events-none z-0"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Top left - Coral */}
        <div
          className="absolute w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-brand-coral rounded-full opacity-25 blur-[80px]"
          style={{ top: '-3rem', left: '-3rem' }}
        />
        {/* Top right - Teal */}
        <div
          className="absolute w-[180px] sm:w-[250px] h-[180px] sm:h-[250px] bg-brand-teal rounded-full opacity-20 blur-[80px]"
          style={{ top: '2rem', right: '-3rem' }}
        />
        {/* Bottom left - Yellow */}
        <div
          className="absolute w-[220px] sm:w-[300px] h-[220px] sm:h-[300px] bg-brand-yellow rounded-full opacity-30 blur-[80px]"
          style={{ bottom: '-3rem', left: '10%' }}
        />
        {/* Bottom right - Pink */}
        <div
          className="absolute w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] bg-brand-pink rounded-full opacity-20 blur-[80px]"
          style={{ bottom: '10%', right: '-2rem' }}
        />
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
              viewBox="0 0 182.59 194.77"
              fill="currentColor"
              role="img"
              aria-label="Halulu logo"
            >
              <path d="M69.46,5.75v35.25c-7.33,1.12-13.99.31-20.95-2.05l-.17-33.08c-2.1-6.84-11.22-7.28-13.36-.09l-.11,32.64c-6.61,3.06-13.72,3.67-20.92,2.58V6.25c0-.76-1.51-3.13-2.25-3.75C7.01-1.45,1.11,1.03,0,6.79l.02,86.9c1.5,13.63,12.86,24.26,26.62,24.38l.69.66-5.37,61.52c1.04,13.38,12.56,15.06,23.77,14.27,11.82-.83,16.31-7.73,15.22-19.27l-5-57.25c13.69-.08,24.73-9.93,26.95-23.3l.02-89.42c-1.59-7.22-12.28-6.68-13.47.47Z"/>
              <path d="M181.95,42.26c-1.63-19.9-22.2-42.26-42.74-42.26h-26.25v183.25c0,6.45,8.81,10.69,14.31,11.19,13.43,1.22,26.16-.22,25.71-16.71l-5.47-59.41c5.97-3.04,12.65-5.19,18.19-9.33,8.24-6.16,15.16-18,16.2-28.3.97-9.7.86-28.62.05-38.43Z"/>
            </svg>
            <span className="font-display text-lg sm:text-xl text-brand-dark">{t('brandName')}</span>
          </motion.button>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* ===== RESET PASSWORD CARD ===== */}
          <div
            className="bg-white border-4 border-brand-dark rounded-2xl p-6 sm:p-8"
            style={{ boxShadow: getRtlShadow('lg', isRTL) }}
          >
            {/* Header with emoji */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="text-5xl mb-3"
              >
                🔐
              </motion.div>
              <h1 className="font-display-black text-2xl sm:text-3xl text-brand-dark">
                {t('auth.resetPasswordTitle')}
              </h1>
              <p className="font-body text-brand-muted mt-2">
                {t('auth.resetPasswordSubtitle')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-xl text-red-700 text-sm font-body"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-100 border-2 border-green-400 rounded-xl text-green-700 text-sm font-body"
              >
                ✅ {success}
              </motion.div>
            )}

            {/* ===== PASSWORD FORM ===== */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block font-display text-sm text-brand-dark mb-1.5">
                  {t('auth.newPassword')}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder') as string}
                  disabled={loading || !!success}
                  className="w-full px-4 py-3 border-3 border-brand-dark rounded-xl font-body text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-coral disabled:opacity-50"
                  style={{ boxShadow: getRtlShadow('xs', isRTL) }}
                />
              </div>

              {/* Confirm New Password Input */}
              <div>
                <label htmlFor="confirmNewPassword" className="block font-display text-sm text-brand-dark mb-1.5">
                  {t('auth.confirmNewPassword')}
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder') as string}
                  disabled={loading || !!success}
                  className="w-full px-4 py-3 border-3 border-brand-dark rounded-xl font-body text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-coral disabled:opacity-50"
                  style={{ boxShadow: getRtlShadow('xs', isRTL) }}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !!success}
                whileHover={{ scale: (loading || success) ? 1 : 1.02 }}
                whileTap={{ scale: (loading || success) ? 1 : 0.98 }}
                className="w-full py-3.5 px-4 bg-brand-coral text-white font-display text-lg rounded-xl border-3 border-brand-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: getRtlShadow('md', isRTL) }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🍕</span>
                    {t('auth.loading')}
                  </span>
                ) : (
                  t('auth.updatePassword')
                )}
              </motion.button>
            </form>

            {/* Back to Sign In */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="font-display text-brand-coral hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                ← {t('auth.backToSignIn')}
              </button>
            </div>
          </div>

          {/* Fun footer message */}
          <p className="text-center mt-6 text-brand-muted font-body text-sm">
            {t('auth.footerMessage')} 🍕
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
