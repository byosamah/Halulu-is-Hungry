/**
 * LanguageContext.tsx
 *
 * Provides language switching functionality for the app.
 * - Supports English (en) and Arabic (ar)
 * - Saves preference to localStorage
 * - Handles RTL direction for Arabic
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { en } from '../translations/en';
import { ar } from '../translations/ar';

// Supported languages
export type Language = 'en' | 'ar';

// Translation type (matches our translation files structure)
export type Translations = typeof en;

// Context value type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
  isRTL: boolean;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Storage key for localStorage
const LANGUAGE_STORAGE_KEY = 'halulu-language';

// Get nested value from object using dot notation (e.g., "filters.cozy")
// Supports returning strings OR arrays (for things like quickTags, inspirations)
const getNestedValue = (obj: Record<string, unknown>, path: string): string | string[] => {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found (for debugging)
    }
  }

  // Return string if it's a string
  if (typeof result === 'string') return result;
  // Return array if it's an array (for quickTags, inspirations, etc.)
  if (Array.isArray(result)) return result as string[];
  // Fallback: return the path for debugging
  return path;
};

// Provider props
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * LanguageProvider
 *
 * Wrap your app with this provider to enable language switching.
 *
 * Usage:
 * ```tsx
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 * ```
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') {
        return saved;
      }
    }
    return 'en';
  });

  // Get translations based on current language
  const translations: Translations = language === 'ar' ? ar : en;

  // Check if current language is RTL
  const isRTL = language === 'ar';

  // Translation function - gets text by key (supports strings and arrays)
  const t = useCallback((key: string): string | string[] => {
    return getNestedValue(translations as unknown as Record<string, unknown>, key);
  }, [translations]);

  // Set language and save to localStorage
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    }
  }, []);

  // Update document direction and title when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      // Update page title to match current language
      document.title = t('brandName') as string;
    }
  }, [language, isRTL, t]);

  // Context value
  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage Hook
 *
 * Use this hook in any component to access language features.
 *
 * Usage:
 * ```tsx
 * const { t, language, setLanguage, isRTL } = useLanguage();
 *
 * return <h1>{t('heroTitle')}</h1>;
 * ```
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageContext;
