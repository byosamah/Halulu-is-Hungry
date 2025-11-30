// ===========================================
// ANALYTICS SERVICE - Search Tracking
// Records search analytics to the database
// Fire-and-forget: doesn't block the user experience
// ===========================================

// ===========================================
// TYPES
// ===========================================

export interface SearchAnalyticsData {
  userId: string;
  query: string;
  latitude: number;
  longitude: number;
  filters: string[];
  isSurpriseMe: boolean;
  isPremium: boolean;
  language: 'en' | 'ar';
  resultsCount: number;
  // Token usage tracking (optional - may not be available on error)
  inputTokens?: number;
  outputTokens?: number;
  modelUsed?: string;
}

// ===========================================
// RECORD SEARCH ANALYTICS
// ===========================================

/**
 * Records a search to the analytics database
 *
 * This is a fire-and-forget function:
 * - Does NOT return a promise you need to await
 * - Does NOT block the user experience
 * - Fails silently (analytics shouldn't break the app)
 *
 * @param data - Search data to record
 */
export function recordSearchAnalytics(data: SearchAnalyticsData): void {
  // Fire-and-forget: don't await this
  // We use a self-invoking async function to handle the promise
  (async () => {
    try {
      const response = await fetch('/api/analytics/record-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Log for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const result = await response.json();
        if (result.success) {
          console.log('[Analytics] Search recorded:', data.query);
        } else {
          console.warn('[Analytics] Failed to record:', result.error);
        }
      }

    } catch (error) {
      // Silent fail - analytics should never break the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] Error recording search:', error);
      }
    }
  })();
}
