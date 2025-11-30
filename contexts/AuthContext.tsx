/**
 * AuthContext.tsx
 *
 * Provides authentication functionality for the app.
 * - Handles sign up, sign in, and sign out
 * - Manages user session state
 * - Works with Supabase Auth
 *
 * How it works:
 * 1. When the app loads, we check if user is already logged in
 * 2. We listen for auth state changes (login, logout, token refresh)
 * 3. Components can access user data via the useAuth hook
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, User, Session } from '../lib/supabase';

// ==================
// TYPES
// ==================

// What the auth context provides to components
interface AuthContextType {
  // Current logged-in user (null if not logged in)
  user: User | null;
  // Current session (contains access token, etc.)
  session: Session | null;
  // Is the auth system still checking if user is logged in?
  loading: boolean;
  // Sign up with email and password
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  // Sign in with email and password
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  // Sign in with Google OAuth
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  // Sign out the current user
  signOut: () => Promise<{ error: Error | null }>;
  // Send password reset email
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  // Update password (after reset link clicked)
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

// Props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// ==================
// CONTEXT
// ==================

// Create the context (starts as undefined until provider wraps app)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================
// PROVIDER
// ==================

/**
 * AuthProvider
 *
 * Wrap your app with this provider to enable authentication.
 *
 * Usage in App.tsx:
 * ```tsx
 * <AuthProvider>
 *   <LanguageProvider>
 *     <Router>...</Router>
 *   </LanguageProvider>
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for current user and session
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // Loading starts as true - we're checking if user is already logged in
  const [loading, setLoading] = useState(true);

  // ==================
  // INITIALIZATION
  // ==================

  // ==================
  // HELPER: Check if user's profile exists in database
  // ==================
  // If user was deleted from auth.users, their profile is cascade-deleted too
  // This catches that case and signs them out immediately
  const verifyProfileExists = async (userId: string): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      // If no profile found, user was deleted
      if (error || !profile) {
        console.warn('Profile not found for user - signing out');
        return false;
      }
      return true;
    } catch {
      // On error, assume profile exists (don't break login on network issues)
      return true;
    }
  };

  // On mount: Check if user is already logged in + listen for changes
  useEffect(() => {
    // 1. Get current session (if user was previously logged in)
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession) {
          // ⚠️ SECURITY: Verify user's profile still exists in database
          // If admin deleted user, their JWT is still valid but profile is gone
          const profileExists = await verifyProfileExists(currentSession.user.id);

          if (!profileExists) {
            // User was deleted - sign them out
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
        // Done checking - no longer loading
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Only verify profile for TOKEN_REFRESHED events (existing sessions)
        // Skip for SIGNED_IN - profile might still be creating via database trigger
        // This prevents a race condition where we check before the profile exists
        if (newSession && event === 'TOKEN_REFRESHED') {
          const profileExists = await verifyProfileExists(newSession.user.id);

          if (!profileExists) {
            // User was deleted - sign them out
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }
        }

        // Update state whenever auth changes
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup: stop listening when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==================
  // AUTH METHODS
  // ==================

  /**
   * Sign up a new user with email and password
   *
   * What happens:
   * 1. Creates a new user in Supabase Auth
   * 2. Supabase sends a confirmation email (by default)
   * 3. User clicks link in email to verify
   * 4. User is now logged in
   */
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Where to redirect after email confirmation
          emailRedirectTo: `${window.location.origin}/app`,
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
   * Sign in existing user with email and password
   *
   * What happens:
   * 1. Validates credentials with Supabase
   * 2. If valid, creates a session
   * 3. onAuthStateChange fires and updates our state
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
   * Sign in with Google OAuth
   *
   * What happens:
   * 1. Redirects to Google's login page
   * 2. User signs in with their Google account
   * 3. Google redirects back to your app
   * 4. Supabase creates/updates the user
   *
   * IMPORTANT: You need to enable Google provider in Supabase dashboard:
   * Authentication > Providers > Google
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Where to redirect after Google auth
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
   * Sign out the current user
   *
   * What happens:
   * 1. Clears the session from Supabase
   * 2. Removes session from localStorage
   * 3. onAuthStateChange fires with null session
   */
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  /**
   * Send password reset email
   *
   * What happens:
   * 1. Supabase sends an email with a reset link
   * 2. Link contains a recovery token
   * 3. User clicks link and goes to reset password page
   */
  const resetPasswordForEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Where to redirect after clicking the reset link in email
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
   * Update user's password
   *
   * What happens:
   * 1. User is on reset password page (has recovery token from email)
   * 2. User enters new password
   * 3. Supabase updates the password
   * 4. User can now sign in with new password
   */
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error };
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

/**
 * useAuth Hook
 *
 * Use this hook in any component to access auth features.
 *
 * Usage:
 * ```tsx
 * const { user, signIn, signOut, loading } = useAuth();
 *
 * if (loading) return <LoadingSpinner />;
 *
 * if (!user) {
 *   return <button onClick={() => signIn('email', 'password')}>Sign In</button>;
 * }
 *
 * return <p>Welcome, {user.email}!</p>;
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
