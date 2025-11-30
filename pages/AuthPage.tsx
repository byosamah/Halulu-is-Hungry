/**
 * AuthPage.tsx
 *
 * Sign In / Sign Up page with neobrutalist design.
 *
 * Features:
 * - Toggle between Sign In and Sign Up modes
 * - Email/Password form
 * - Google OAuth button
 * - Matches the playful app design
 * - Full RTL support for Arabic
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getRtlShadow } from '../utils/rtlShadow';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle, resetPasswordForEmail } = useAuth();

  // Form mode: 'signIn', 'signUp', or 'forgotPassword'
  type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';
  const [mode, setMode] = useState<AuthMode>('signIn');

  // Helper for cleaner code
  const isSignUp = mode === 'signUp';
  const isForgotPassword = mode === 'forgotPassword';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/app');
    }
  }, [user, authLoading, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate inputs
    if (!email || !password) {
      setError(t('auth.errorEmptyFields') as string);
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(t('auth.errorPasswordMismatch') as string);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errorPasswordTooShort') as string);
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up new user
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          // Show success message - user needs to verify email
          setSuccess(t('auth.successSignUp') as string);
        }
      } else {
        // Sign in existing user
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
        }
        // If successful, the useEffect will redirect to /app
      }
    } catch (err) {
      setError(t('auth.errorGeneric') as string);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError.message);
      }
      // If successful, Google will redirect and handle the rest
    } catch (err) {
      setError(t('auth.errorGeneric') as string);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email) {
      setError(t('auth.errorEmptyFields') as string);
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await resetPasswordForEmail(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        // Show success message
        setSuccess(t('auth.resetLinkSent') as string);
      }
    } catch (err) {
      setError(t('auth.errorGeneric') as string);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-4xl animate-bounce">🍕</div>
      </div>
    );
  }

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
          {/* ===== AUTH CARD ===== */}
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
                {isForgotPassword ? '🔑' : isSignUp ? '🎉' : '👋'}
              </motion.div>
              <h1 className="font-display-black text-2xl sm:text-3xl text-brand-dark">
                {isForgotPassword
                  ? t('auth.forgotPasswordTitle')
                  : isSignUp
                    ? t('auth.signUpTitle')
                    : t('auth.signInTitle')}
              </h1>
              <p className="font-body text-brand-muted mt-2">
                {isForgotPassword
                  ? t('auth.forgotPasswordSubtitle')
                  : isSignUp
                    ? t('auth.signUpSubtitle')
                    : t('auth.signInSubtitle')}
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

            {/* ===== GOOGLE SIGN IN BUTTON (hidden in forgot password mode) ===== */}
            {!isForgotPassword && (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full mb-4 py-3 px-4 bg-white border-3 border-brand-dark rounded-xl font-display text-brand-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{ boxShadow: getRtlShadow('sm', isRTL) }}
                >
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('auth.continueWithGoogle')}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-0.5 bg-gray-200"></div>
                  <span className="text-brand-muted text-sm font-body">{t('auth.orDivider')}</span>
                  <div className="flex-1 h-0.5 bg-gray-200"></div>
                </div>
              </>
            )}

            {/* ===== EMAIL/PASSWORD FORM ===== */}
            <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block font-display text-sm text-brand-dark mb-1.5">
                  {t('auth.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder') as string}
                  disabled={loading}
                  className="w-full px-4 py-3 border-3 border-brand-dark rounded-xl font-body text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-coral disabled:opacity-50"
                  style={{ boxShadow: getRtlShadow('xs', isRTL) }}
                />
              </div>

              {/* Password Input (hidden in forgot password mode) */}
              {!isForgotPassword && (
                <div>
                  <label htmlFor="password" className="block font-display text-sm text-brand-dark mb-1.5">
                    {t('auth.passwordLabel')}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder') as string}
                    disabled={loading}
                    className="w-full px-4 py-3 border-3 border-brand-dark rounded-xl font-body text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-coral disabled:opacity-50"
                    style={{ boxShadow: getRtlShadow('xs', isRTL) }}
                  />
                  {/* Forgot Password Link (only in Sign In mode) */}
                  {!isSignUp && (
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgotPassword');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-sm font-body text-brand-coral hover:underline"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="confirmPassword" className="block font-display text-sm text-brand-dark mb-1.5">
                    {t('auth.confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder') as string}
                    disabled={loading}
                    className="w-full px-4 py-3 border-3 border-brand-dark rounded-xl font-body text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-coral disabled:opacity-50"
                    style={{ boxShadow: getRtlShadow('xs', isRTL) }}
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 px-4 bg-brand-coral text-white font-display text-lg rounded-xl border-3 border-brand-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: getRtlShadow('md', isRTL) }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🍕</span>
                    {t('auth.loading')}
                  </span>
                ) : isForgotPassword ? (
                  t('auth.sendResetLink')
                ) : isSignUp ? (
                  t('auth.signUpButton')
                ) : (
                  t('auth.signInButton')
                )}
              </motion.button>
            </form>

            {/* Toggle Sign In / Sign Up / Back to Sign In */}
            <div className="mt-6 text-center">
              {isForgotPassword ? (
                // Back to Sign In link
                <button
                  type="button"
                  onClick={() => {
                    setMode('signIn');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="font-display text-brand-coral hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  ← {t('auth.backToSignIn')}
                </button>
              ) : (
                // Toggle between Sign In and Sign Up
                <p className="font-body text-brand-muted">
                  {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(isSignUp ? 'signIn' : 'signUp');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="font-display text-brand-coral hover:underline"
                  >
                    {isSignUp ? t('auth.signInLink') : t('auth.signUpLink')}
                  </button>
                </p>
              )}
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

export default AuthPage;
