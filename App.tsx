/**
 * App.tsx
 *
 * Main application component that handles routing between pages.
 *
 * Routes:
 * - / (root): Landing page with hero, story, and CTA
 * - /auth: Sign in / Sign up page
 * - /app: Main search and results page (requires auth)
 *
 * Providers (wrapped from outside to inside):
 * - AuthProvider: Handles user authentication state
 * - UsageProvider: Tracks search usage limits
 * - LanguageProvider: Handles i18n and RTL support
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UsageProvider } from './contexts/UsageContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * If user is not logged in, redirects to /auth page.
 *
 * How it works:
 * 1. Checks if auth is still loading (shows spinner)
 * 2. If loaded and no user → redirect to /auth
 * 3. If loaded and user exists → render the children
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  // Still checking auth state - show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🍕</div>
          <p className="font-body text-brand-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in - render the protected content
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    // AuthProvider must be OUTSIDE Router to persist across navigation
    // UsageProvider needs AuthProvider to know who the user is
    <AuthProvider>
      <UsageProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              {/* Landing page - public, no auth required */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth page - sign in / sign up */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Reset password page - for setting new password after email link */}
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

              {/* Pricing page - public, shows subscription options */}
              <Route path="/pricing" element={<PricingPage />} />

              {/* App page - PROTECTED: requires authentication */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppPage />
                  </ProtectedRoute>
                }
              />

              {/* Profile page - PROTECTED: requires authentication */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </LanguageProvider>
      </UsageProvider>
    </AuthProvider>
  );
};

export default App;
