/**
 * AuthContext.tsx
 *
 * Provides authentication functionality for the app.
 * - Routes auth calls through Vercel API for logging
 * - Handles sign up, sign in, and sign out
 * - Manages user session state
 * - Works with Supabase Auth
 *
 * Flow:
 * 1. Auth calls go to /api/auth/* (visible in Vercel logs)
 * 2. API returns session data
 * 3. Client sets session using supabase.auth.setSession()
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, User, Session } from '../lib/supabase';

// ==================
// TYPES
// ==================

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ==================
// CONTEXT
// ==================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================
// PROVIDER
// ==================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // ==================
  // HELPER: Verify profile exists (via API route for Vercel logs)
  // ==================
  const verifyProfileExists = async (userId: string): Promise<boolean> => {
    try {
      // Call Vercel API route instead of Supabase directly
      const response = await fetch('/api/auth/verify-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!data.exists) {
        console.warn('Profile not found for user - signing out');
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  // ==================
  // INITIALIZATION
  // ==================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession) {
          const profileExists = await verifyProfileExists(currentSession.user.id);

          if (!profileExists) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }

          setSession(currentSession);
          setUser(currentSession.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (newSession && event === 'TOKEN_REFRESHED') {
          const profileExists = await verifyProfileExists(newSession.user.id);

          if (!profileExists) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==================
  // AUTH METHODS (via API routes)
  // ==================

  /**
   * Sign up via /api/auth/signup
   */
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          redirectTo: `${window.location.origin}/app`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Signup failed') };
      }

      // If session returned (no email verification required), set it
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  /**
   * Sign in via /api/auth/signin
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Signin failed') };
      }

      // Set the session returned from API
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  /**
   * Sign in with Google OAuth
   * Note: This stays client-side because it's redirect-based
   * We log the initiation via API
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      // Log the OAuth initiation
      fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'google_oauth_initiated' }),
      }).catch(() => {}); // Fire and forget

      // OAuth must happen client-side (redirect-based)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  /**
   * Sign out - log via API, then clear client session
   */
  const signOut = useCallback(async () => {
    try {
      // Log the signout
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
        }),
      }).catch(() => {}); // Continue even if logging fails

      // Clear the session client-side
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user]);

  /**
   * Reset password via /api/auth/reset-password
   */
  const resetPasswordForEmail = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Reset password failed') };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  /**
   * Update password via /api/auth/update-password
   */
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      // Get current access token
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!currentSession?.access_token) {
        return { error: new Error('No active session') };
      }

      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: currentSession.access_token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Update password failed') };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // ==================
  // CONTEXT VALUE
  // ==================

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPasswordForEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================
// HOOK
// ==================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
