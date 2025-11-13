import { GoogleGenAI } from "@google/genai";
import type { Restaurant, Coordinates, FilterState } from '../types';
import { QuotaExceededError, APIKeyError, NetworkError, InvalidResponseError } from '../types';

const model = "gemini-2.0-flash-exp";

function cleanJsonString(str: string): string {
    // Attempts to remove markdown formatting and extraneous text around a JSON object/array
    const match = str.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    return match ? match[0] : str;
}

// Note: Retry logic and fallback URLs removed per user requirement for real data only

// Validate API key is configured (for early detection)
export function validateAPIKey(): boolean {
  return !!process.env.API_KEY;
}


export const findRestaurants = async (
  location: Coordinates,
  query: string,
  filters: FilterState, // Changed from string[] to FilterState
  signal?: AbortSignal
): Promise<Restaurant[]> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    // This provides a more user-friendly error in the console.
    console.error("API_KEY environment variable not set. Please ensure your project is configured correctly.");
    throw new APIKeyError("API key is not configured. Please add GEMINI_API_KEY to your .env.local file.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Build filter descriptions for the prompt
  const filterDescriptions: string[] = [];

  if (filters.attributes.length > 0) {
    filterDescriptions.push(`Atmosphere: ${filters.attributes.join(', ')}`);
  }

  if (filters.priceRanges.length > 0) {
    const priceLabels: Record<string, string> = {
      'budget': '$',
      'moderate': '$$',
      'upscale': '$$$',
      'fine-dining': '$$$$'
    };
    const priceStrings = filters.priceRanges.map(p => priceLabels[p] || p);
    filterDescriptions.push(`Price Range: ${priceStrings.join(', ')}`);
  }

  if (filters.cuisineTypes.length > 0) {
    filterDescriptions.push(`Cuisine Types: ${filters.cuisineTypes.join(', ')}`);
  }

  if (filters.distance) {
    filterDescriptions.push(`Maximum Distance: Within ${filters.distance} miles`);
  }

  if (filters.dietaryRestrictions.length > 0) {
    filterDescriptions.push(`Dietary Requirements: ${filters.dietaryRestrictions.join(', ')}`);
  }

  const filtersText = filterDescriptions.length > 0
    ? filterDescriptions.join('; ')
    : 'None';

  const prompt = `
    You are an expert restaurant recommender. Your task is to find and rank restaurants based on the user's request, location, and filters, analyze their Google reviews, and provide a structured summary. Your ranking must be sophisticated, considering not just the rating but also the number of reviews to determine reliability.

    User Request: "Find me the best ${query}."
    Filters: ${filtersText}.

    Based on this, perform the following actions:
    1. Find relevant restaurants on Google Maps that match the request.
    2. **Crucially, rank the results based on a weighted score that considers both the Google rating and the number of reviews.** A restaurant with a slightly lower rating but a vastly larger number of reviews is a more reliable and generally better recommendation. For example, a restaurant with a 4.7 rating from 2000 reviews is superior to one with a 4.9 rating from 100 reviews.
    3. For each restaurant, deeply analyze its reviews to gauge public sentiment.
    4. Generate an "aiRating" on a scale of 1.0 to 5.0 (one decimal place). This rating **must reflect your weighted analysis** from step 2, combining rating value and review volume. It should NOT be just a reflection of the Google rating.
    5. Extract three representative **direct quotes** for "pros" from the reviews. These should be actual snippets that capture common positive feedback.
    6. Extract three representative **direct quotes** for "cons" from the reviews. These should be actual snippets that capture common negative feedback.
    7. Extract the official Google Maps star rating and the total number of reviews.

    Return your findings as a VALID JSON array of objects, ordered by your calculated reliable ranking. Each object must have the following keys and data types:
    - "name": string (The full name of the restaurant)
    - "aiRating": number (e.g., 4.7 - your calculated weighted score)
    - "googleRating": number (e.g., 4.5 - the raw Google rating)
    - "googleReviewsCount": number (e.g., 1250)
    - "pros": string[] (An array of exactly 3 **direct quotes** from positive reviews)
    - "cons": string[] (An array of exactly 3 **direct quotes** from negative reviews)

    IMPORTANT: Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON array. The entire response must be only the JSON data. Each pro and con MUST be a direct quote from a review.
  `;

  // Check if request was cancelled before starting
  if (signal?.aborted) {
    throw new Error('Request was cancelled');
  }

  try {
    const response = await ai.models.generateContent({
      model,
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

    // Check if request was cancelled after API call
    if (signal?.aborted) {
      throw new Error('Request was cancelled');
    }

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
    const mapsData = new Map<string, { uri: string, title: string, photo?: string }>();
    groundingChunks.forEach(chunk => {
      if (chunk.maps) {
        // Normalize names for better matching
        const normalizedTitle = chunk.maps.title.toLowerCase().trim();
        // Extract photo URL if available (Google Maps photo reference)
        const photo = chunk.maps.photoUri || chunk.maps.photo || undefined;
        mapsData.set(normalizedTitle, {
          uri: chunk.maps.uri,
          title: chunk.maps.title,
          photo
        });
      }
    });

    // Only include restaurants with real Google Maps data (no fallbacks per user requirement)
    const enrichedRestaurants: Restaurant[] = parsedRestaurants
      .filter(restaurant => {
        const normalizedName = restaurant.name.toLowerCase().trim();
        const mapInfo = mapsData.get(normalizedName);

        if (!mapInfo) {
          console.warn(`Skipping "${restaurant.name}" - no Google Maps grounding data available`);
          return false;
        }
        return true;
      })
      .map(restaurant => {
        const normalizedName = restaurant.name.toLowerCase().trim();
        const mapInfo = mapsData.get(normalizedName)!;

        return {
          ...restaurant,
          mapsUrl: mapInfo.uri,
          title: mapInfo.title,
          photo: mapInfo.photo, // Add photo URL from grounding data
        };
      });

    return enrichedRestaurants;
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

    // Default fallback for unknown errors
    throw new Error(`Could not retrieve restaurant data: ${errorMessage}`);
  }
};