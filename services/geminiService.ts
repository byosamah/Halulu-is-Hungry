import { GoogleGenAI } from "@google/genai";
import type { Restaurant, Coordinates } from '../types';
import { QuotaExceededError, APIKeyError, NetworkError, InvalidResponseError } from '../types';
import { AI_MODEL_NAME, AI_MODEL_NAME_FLASH } from '../constants';

// ==========================================
// SECURITY: Input Validation
// أمان: التحقق من المدخلات
// ==========================================

/**
 * SECURITY: Maximum allowed length for search queries
 * Prevents excessively long prompts that could consume API quota
 * حد أقصى لطول استعلامات البحث لمنع استنفاد حصة API
 */
const MAX_QUERY_LENGTH = 200;

function cleanJsonString(str: string): string {
    // Attempts to remove markdown formatting and extraneous text around a JSON object/array
    const match = str.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    return match ? match[0] : str;
}

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 2000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry non-quota errors
      if (!(error instanceof QuotaExceededError)) {
        throw error;
      }

      // Don't wait after last attempt
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt); // Exponential: 2s, 4s, 8s
        console.log(`Quota exceeded. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Validate API key is configured (for early detection)
export function validateAPIKey(): boolean {
  return !!process.env.API_KEY;
}


export const findRestaurants = async (
  location: Coordinates,
  query: string,
  filters: string[],
  isPremium: boolean = false,  // Premium users get Pro, free users get Flash
  language: 'en' | 'ar' = 'en'  // Language for AI responses
): Promise<Restaurant[]> => {
  // ==========================================
  // SECURITY: Validate input before processing
  // أمان: التحقق من المدخلات قبل المعالجة
  // ==========================================

  // Validate query is not empty
  if (!query || query.trim().length === 0) {
    throw new InvalidResponseError('Search query cannot be empty.');
  }

  // Validate query length (prevent excessive API token usage)
  if (query.length > MAX_QUERY_LENGTH) {
    throw new InvalidResponseError(`Search query too long (max ${MAX_QUERY_LENGTH} characters).`);
  }

  // Validate location coordinates
  if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
    throw new InvalidResponseError('Invalid location coordinates.');
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    // This provides a more user-friendly error in the console.
    console.error("API_KEY environment variable not set. Please ensure your project is configured correctly.");
    throw new APIKeyError("API key is not configured. Please add GEMINI_API_KEY to your .env.local file.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    ${language === 'ar' ? `
    ⚠️ CRITICAL LANGUAGE REQUIREMENT - ARABIC ⚠️
    The user interface is in ARABIC. You MUST:
    - Write ALL "pros" quotes in Arabic language (translate English reviews to Arabic)
    - Write ALL "cons" quotes in Arabic language (translate English reviews to Arabic)
    - Use natural, colloquial Arabic that sounds authentic
    - Keep restaurant names in their original language (don't translate names)
    This is MANDATORY - do NOT return any English text in pros/cons arrays.
    ` : ''}
    You are an expert restaurant recommender. Your task is to find and rank restaurants based on the user's request and location, analyze their Google reviews, and provide a structured summary. Your ranking must be sophisticated, considering not just the rating but also the number of reviews to determine reliability.

    User Request: "Find me the best ${query}."
    Filters: ${filters.length > 0 ? filters.join(', ') : 'None'}.

    Based on this, perform the following actions:
    1. Find relevant restaurants on Google Maps that match the request.
    2. **Crucially, rank the results based on a weighted score that considers both the Google rating and the number of reviews.** A restaurant with a slightly lower rating but a vastly larger number of reviews is a more reliable and generally better recommendation. For example, a restaurant with a 4.7 rating from 2000 reviews is superior to one with a 4.9 rating from 100 reviews.
    3. For each restaurant, deeply analyze its reviews to gauge public sentiment.
    4. Generate an "aiRating" on a scale of 1.0 to 5.0 (one decimal place). This rating **must reflect your weighted analysis** from step 2, combining rating value and review volume. It should NOT be just a reflection of the Google rating.
    5. Extract three representative **direct quotes** for "pros" from the reviews. These should be actual snippets that capture common positive feedback.
    6. Extract three representative **direct quotes** for "cons" from the reviews. These should be actual snippets that capture common negative feedback.
    7. Extract the official Google Maps star rating and the total number of reviews.
    8. **IMPORTANT: Return only UNIQUE restaurants. Do not include the same restaurant twice, even if it appears multiple times in search results. Each restaurant in your response must be distinct.**

    Return your findings as a VALID JSON array of objects, ordered by your calculated reliable ranking. Each object must have the following keys and data types:
    - "name": string (The full name of the restaurant)
    - "aiRating": number (e.g., 4.7 - your calculated weighted score)
    - "googleRating": number (e.g., 4.5 - the raw Google rating)
    - "googleReviewsCount": number (e.g., 1250)
    - "pros": string[] (An array of exactly 3 **direct quotes** from positive reviews)
    - "cons": string[] (An array of exactly 3 **direct quotes** from negative reviews)

    IMPORTANT: Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON array. The entire response must be only the JSON data. Each pro and con MUST be a direct quote from a review.
  `;

  // Wrap API call in retry logic to handle temporary rate limits
  const makeAPICall = async () => {
    try {
      return await ai.models.generateContent({
        model: isPremium ? AI_MODEL_NAME : AI_MODEL_NAME_FLASH,
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: location
            }
          }
        },
      });
    } catch (error: any) {
      // Detect and throw specific error types for retry logic
      const errorMessage = error?.message || String(error);
      const errorString = JSON.stringify(error);

      if (error?.status === 429 || error?.code === 429 ||
          errorMessage.includes('429') || errorMessage.includes('quota') ||
          errorMessage.includes('rate limit') || errorString.includes('RESOURCE_EXHAUSTED')) {
        throw new QuotaExceededError('API rate limit exceeded.');
      }

      throw error;
    }
  };

  try {
    // Use retry logic - will auto-retry up to 3 times on quota errors
    const response = await retryWithBackoff(makeAPICall);

    const cleanedText = cleanJsonString(response.text);
    let parsedRestaurants: Omit<Restaurant, 'mapsUrl' | 'title'>[] = [];
    try {
        parsedRestaurants = JSON.parse(cleanedText);
    } catch(e) {
        console.error("Failed to parse JSON response:", cleanedText);
        throw new InvalidResponseError("AI returned an invalid data format. Please try your search again.");
    }

    if(!Array.isArray(parsedRestaurants)) {
        throw new InvalidResponseError("AI response was not an array. Please try again.");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsData = new Map<string, { uri: string, title: string }>();
    groundingChunks.forEach(chunk => {
      if (chunk.maps) {
        // Normalize names for better matching
        const normalizedTitle = chunk.maps.title.toLowerCase().trim();
        mapsData.set(normalizedTitle, { uri: chunk.maps.uri, title: chunk.maps.title });
      }
    });

    const enrichedRestaurants: Restaurant[] = parsedRestaurants.map(restaurant => {
      const normalizedName = restaurant.name.toLowerCase().trim();
      const mapInfo = mapsData.get(normalizedName);

      // Require valid Maps data - no fallback URLs
      if (!mapInfo?.uri) {
        throw new InvalidResponseError(
          `Maps data unavailable for "${restaurant.name}". Please try your search again.`
        );
      }

      return {
        ...restaurant,
        mapsUrl: mapInfo.uri,
        title: mapInfo.title || restaurant.name,
      };
    });

    // ===================
    // DEDUPLICATION
    // ===================
    // Gemini sometimes returns the same restaurant multiple times with different data.
    // We deduplicate by Google Maps URL (unique identifier) and keep the entry
    // with the highest review count (most reliable data).
    const seenUrls = new Map<string, Restaurant>();

    for (const restaurant of enrichedRestaurants) {
      const existing = seenUrls.get(restaurant.mapsUrl);

      if (!existing) {
        // First time seeing this URL
        seenUrls.set(restaurant.mapsUrl, restaurant);
      } else if (restaurant.googleReviewsCount > existing.googleReviewsCount) {
        // Keep the one with more reviews (more reliable data)
        seenUrls.set(restaurant.mapsUrl, restaurant);
      }
    }

    // Convert back to array, preserving original order by AI ranking
    const dedupedRestaurants = enrichedRestaurants.filter(r =>
      seenUrls.get(r.mapsUrl) === r
    );

    return dedupedRestaurants;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);

    // Detect specific error types
    const errorMessage = error?.message || String(error);
    const errorString = JSON.stringify(error);

    // Check for 429 quota errors
    if (error?.status === 429 || error?.code === 429 ||
        errorMessage.includes('429') || errorMessage.includes('quota') ||
        errorMessage.includes('rate limit') || errorString.includes('RESOURCE_EXHAUSTED')) {
      throw new QuotaExceededError('API rate limit exceeded. Please wait a few minutes and try again.');
    }

    // Check for API key errors
    if (error?.status === 401 || error?.status === 403 ||
        errorMessage.includes('API key') || errorMessage.includes('unauthorized')) {
      throw new APIKeyError('Invalid API key. Please check your configuration.');
    }

    // Check for network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') ||
        error?.name === 'NetworkError' || !navigator.onLine) {
      throw new NetworkError('Network error. Please check your internet connection.');
    }

    // If we already threw a specific error type, re-throw it
    if (error instanceof QuotaExceededError || error instanceof APIKeyError ||
        error instanceof NetworkError || error instanceof InvalidResponseError) {
      throw error;
    }

    // Generic error - don't leak internal details
    throw new Error('An unexpected error occurred. Please try again.');
  }
};