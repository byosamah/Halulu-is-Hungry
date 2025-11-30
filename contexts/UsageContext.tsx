/**
 * UsageContext.tsx
 *
 * Tracks user's search usage and limits.
 * Now routes through Vercel API for logging visibility.
 *
 * Features:
 * - Fetches current month's usage via /api/usage
 * - Checks if user can perform a search
 * - Increments usage via /api/usage/increment
 * - Provides remaining searches count
 *
 * Usage limits:
 * - Free users: 3 searches/month
 * - Premium users: 30 searches/month
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// ==================
// CONSTANTS
// ==================

export const SEARCH_LIMITS = {
  free: 3,
  premium: 30,
} as const;

// ==================
// TYPES
// ==================

interface UsageData {
  searchCount: number;
  searchLimit: number;
  remaining: number;
  isPremium: boolean;
  monthYear: string;
}

interface UsageContextType {
  usage: UsageData | null;
  loading: boolean;
  error: string | null;
  canSearch: boolean;
  checkCanSearch: () => boolean;
  incrementUsage: () => Promise<boolean>;
  refreshUsage: () => Promise<void>;
}

// ==================
// CONTEXT
// ==================

const UsageContext = createContext<UsageContextType | undefined>(undefined);

// ==================
// PROVIDER
// ==================

interface UsageProviderProps {
  children: ReactNode;
}

export const UsageProvider: React.FC<UsageProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================
  // FETCH USAGE (via API)
  // ==================

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setUsage(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call API route instead of Supabase directly
      const response = await fetch(`/api/usage?userId=${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('Error fetching usage:', data.error);
        // Use defaults on error
        setUsage({
          searchCount: 0,
          searchLimit: SEARCH_LIMITS.free,
          remaining: SEARCH_LIMITS.free,
          isPremium: false,
          monthYear: new Date().toISOString().slice(0, 7),
        });
      } else {
        setUsage({
          searchCount: data.searchCount,
          searchLimit: data.searchLimit,
          remaining: data.remaining,
          isPremium: data.isPremium,
          monthYear: data.monthYear,
        });
      }
    } catch (err) {
      console.error('Error in fetchUsage:', err);
      // Use defaults on error
      setUsage({
        searchCount: 0,
        searchLimit: SEARCH_LIMITS.free,
        remaining: SEARCH_LIMITS.free,
        isPremium: false,
        monthYear: new Date().toISOString().slice(0, 7),
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch usage when user changes
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // ==================
  // CHECK CAN SEARCH
  // ==================

  const checkCanSearch = useCallback((): boolean => {
    if (!usage) return true;
    return usage.remaining > 0;
  }, [usage]);

  const canSearch = usage ? usage.remaining > 0 : true;

  // ==================
  // INCREMENT USAGE (via API)
  // ==================

  const incrementUsage = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Call API route instead of Supabase directly
      const response = await fetch('/api/usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error incrementing usage:', data.error);
        // Update locally on error
        if (usage) {
          setUsage({
            ...usage,
            searchCount: usage.searchCount + 1,
            remaining: Math.max(0, usage.remaining - 1),
          });
        }
        return true;
      }

      // Refresh usage data after increment
      await fetchUsage();

      return data.isAllowed ?? true;
    } catch (err) {
      console.error('Error in incrementUsage:', err);
      // Update locally on error
      if (usage) {
        setUsage({
          ...usage,
          searchCount: usage.searchCount + 1,
          remaining: Math.max(0, usage.remaining - 1),
        });
      }
      return true;
    }
  }, [user, usage, fetchUsage]);

  // ==================
  // CONTEXT VALUE
  // ==================

  const value: UsageContextType = {
    usage,
    loading,
    error,
    canSearch,
    checkCanSearch,
    incrementUsage,
    refreshUsage: fetchUsage,
  };

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  );
};

// ==================
// HOOK
// ==================

export const useUsage = (): UsageContextType => {
  const context = useContext(UsageContext);

  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }

  return context;
};

export default UsageContext;
