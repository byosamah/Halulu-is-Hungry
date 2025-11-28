/**
 * UsageContext.tsx
 *
 * Tracks user's search usage and limits.
 *
 * Features:
 * - Fetches current month's usage from Supabase
 * - Checks if user can perform a search
 * - Increments usage after each search
 * - Provides remaining searches count
 *
 * Usage limits:
 * - Free users: 5 searches/month
 * - Premium users: 50 searches/month
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// ==================
// CONSTANTS
// ==================

export const SEARCH_LIMITS = {
  free: 5,
  premium: 50,
} as const;

// ==================
// TYPES
// ==================

interface UsageData {
  searchCount: number;      // Current month's search count
  searchLimit: number;      // User's limit (5 or 50)
  remaining: number;        // Searches remaining
  isPremium: boolean;       // Is user premium?
  monthYear: string;        // Current month (e.g., '2025-01')
}

interface UsageContextType {
  // Current usage data
  usage: UsageData | null;
  // Is usage data loading?
  loading: boolean;
  // Any error message
  error: string | null;
  // Can the user perform a search?
  canSearch: boolean;
  // Check if user can search (returns boolean)
  checkCanSearch: () => boolean;
  // Increment search count (call after successful search)
  incrementUsage: () => Promise<boolean>;
  // Refresh usage data from server
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
  // FETCH USAGE
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
      // Call the Supabase function to get usage
      const { data, error: fetchError } = await supabase
        .rpc('get_user_usage', { p_user_id: user.id });

      if (fetchError) {
        console.error('Error fetching usage:', fetchError);
        // If function doesn't exist yet, use defaults
        if (fetchError.message.includes('function') || fetchError.code === '42883') {
          // Function not created yet - use defaults
          setUsage({
            searchCount: 0,
            searchLimit: SEARCH_LIMITS.free,
            remaining: SEARCH_LIMITS.free,
            isPremium: false,
            monthYear: new Date().toISOString().slice(0, 7),
          });
        } else {
          setError(fetchError.message);
        }
      } else if (data && data.length > 0) {
        const row = data[0];
        setUsage({
          searchCount: row.search_count,
          searchLimit: row.search_limit,
          remaining: row.remaining,
          isPremium: row.is_premium,
          monthYear: row.month_year,
        });
      } else {
        // No data returned - use defaults
        setUsage({
          searchCount: 0,
          searchLimit: SEARCH_LIMITS.free,
          remaining: SEARCH_LIMITS.free,
          isPremium: false,
          monthYear: new Date().toISOString().slice(0, 7),
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
    if (!usage) return true; // Allow if no data yet
    return usage.remaining > 0;
  }, [usage]);

  // Computed property for canSearch
  const canSearch = usage ? usage.remaining > 0 : true;

  // ==================
  // INCREMENT USAGE
  // ==================

  const incrementUsage = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Call the Supabase function to increment
      const { data, error: incrementError } = await supabase
        .rpc('increment_search_count', { p_user_id: user.id });

      if (incrementError) {
        console.error('Error incrementing usage:', incrementError);

        // If function doesn't exist, update locally
        if (incrementError.message.includes('function') || incrementError.code === '42883') {
          // Update local state only
          if (usage) {
            setUsage({
              ...usage,
              searchCount: usage.searchCount + 1,
              remaining: Math.max(0, usage.remaining - 1),
            });
          }
          return true;
        }
        return false;
      }

      // Refresh usage data after increment
      await fetchUsage();

      // Check if the search was allowed
      if (data && data.length > 0) {
        return data[0].is_allowed;
      }

      return true;
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

/**
 * useUsage Hook
 *
 * Access search usage data and methods.
 *
 * @example
 * const { usage, canSearch, incrementUsage } = useUsage();
 *
 * // Before searching:
 * if (!canSearch) {
 *   showUpgradeModal();
 *   return;
 * }
 *
 * // After successful search:
 * await incrementUsage();
 */
export const useUsage = (): UsageContextType => {
  const context = useContext(UsageContext);

  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }

  return context;
};

export default UsageContext;
