// ===========================================
// GEMINI SERVICE - Client-side API wrapper
// Now routes through /api/search (Vercel serverless)
// API key is hidden server-side for security
// ===========================================

import type { Restaurant, Coordinates } from '../types';
import { QuotaExceededError, APIKeyError, NetworkError, InvalidResponseError } from '../types';

// ===========================================
// TYPES
// ===========================================

// Token usage data returned from Gemini API
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
}

// Complete search result including restaurants and token usage
export interface SearchResult {
  restaurants: Restaurant[];
  tokenUsage?: TokenUsage;
}

// ===========================================
// CONFIGURATION
// ===========================================

const MAX_QUERY_LENGTH = 200;

// ===========================================
// VALIDATE API KEY (for backwards compatibility)
// Now always returns true since key is on server
// ===========================================

export function validateAPIKey(): boolean {
  return true; // Key is now server-side
}

// ===========================================
// MAIN SEARCH FUNCTION
// ===========================================

/**
 * Find restaurants matching the user's query
 * Routes through /api/search serverless function
 *
 * @param location - User's coordinates (lat/lng)
 * @param query - What the user is craving (e.g., "spicy ramen")
 * @param filters - Optional filters (e.g., "Cozy", "Outdoor seating")
 * @param isPremium - Premium users get better AI model
 * @param language - 'en' or 'ar' for response language
 * @returns SearchResult with restaurants and token usage for analytics
 */
export const findRestaurants = async (
  location: Coordinates,
  query: string,
  filters: string[],
  isPremium: boolean = false,
  language: 'en' | 'ar' = 'en'
): Promise<SearchResult> => {

  // ===========================================
  // CLIENT-SIDE VALIDATION
  // Quick checks before making API call
  // ===========================================

  // Validate query is not empty
  if (!query || query.trim().length === 0) {
    throw new InvalidResponseError('Search query cannot be empty.');
  }

  // Validate query length
  if (query.length > MAX_QUERY_LENGTH) {
    throw new InvalidResponseError(`Search query too long (max ${MAX_QUERY_LENGTH} characters).`);
  }

  // Validate location coordinates
  if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
    throw new InvalidResponseError('Invalid location coordinates.');
  }

  // ===========================================
  // CALL API ROUTE
  // ===========================================

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        query,
        filters,
        isPremium,
        language,
      }),
    });

    // ===========================================
    // HANDLE RESPONSE
    // ===========================================

    const data = await response.json();

    // Handle specific error types from API
    if (!response.ok) {
      const errorType = data.errorType || 'UNKNOWN';
      const errorMessage = data.error || 'An unexpected error occurred.';

      switch (errorType) {
        case 'QUOTA_EXCEEDED':
          throw new QuotaExceededError(errorMessage);
        case 'API_KEY_ERROR':
          throw new APIKeyError(errorMessage);
        default:
          // Check status code for additional context
          if (response.status === 429) {
            throw new QuotaExceededError(errorMessage);
          }
          if (response.status === 401 || response.status === 403) {
            throw new APIKeyError(errorMessage);
          }
          throw new InvalidResponseError(errorMessage);
      }
    }

    // Success - return restaurants and token usage for analytics
    return {
      restaurants: data.restaurants,
      tokenUsage: data.tokenUsage
    };

  } catch (error: any) {
    // ===========================================
    // ERROR HANDLING
    // ===========================================

    // If it's already one of our error types, re-throw
    if (error instanceof QuotaExceededError ||
        error instanceof APIKeyError ||
        error instanceof NetworkError ||
        error instanceof InvalidResponseError) {
      throw error;
    }

    // Network errors (fetch failed, no internet, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Network error. Please check your internet connection.');
    }

    if (!navigator.onLine) {
      throw new NetworkError('You appear to be offline. Please check your connection.');
    }

    // Unknown errors
    console.error('Search error:', error);
    throw new InvalidResponseError('An unexpected error occurred. Please try again.');
  }
};
