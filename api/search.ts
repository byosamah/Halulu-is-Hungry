// ===========================================
// VERCEL API ROUTE: /api/search
// Routes restaurant searches through Vercel server
// Benefits: API key hidden, requests visible in Vercel logs
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

// ===========================================
// TYPE DEFINITIONS (duplicated from types.ts for serverless)
// ===========================================

interface Restaurant {
  name: string;
  aiRating: number;
  pros: string[];
  cons: string[];
  mapsUrl: string;
  title: string;
  googleRating: number;
  googleReviewsCount: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

// ===========================================
// CONSTANTS
// ===========================================

const AI_MODEL_NAME = 'gemini-2.5-pro';        // Premium users
const AI_MODEL_NAME_FLASH = 'gemini-2.5-flash'; // Free users
const MAX_QUERY_LENGTH = 200;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000;

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Clean JSON string from markdown formatting
 */
function cleanJsonString(str: string): string {
  const match = str.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  return match ? match[0] : str;
}

/**
 * Retry with exponential backoff for quota errors
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Only retry on quota errors
      const errorMessage = (error as Error)?.message || '';
      const isQuotaError =
        errorMessage.includes('429') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('RESOURCE_EXHAUSTED');

      if (!isQuotaError) {
        throw error;
      }

      // Don't wait after last attempt
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`[API] Quota exceeded. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// ===========================================
// MAIN HANDLER
// ===========================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Log request for Vercel dashboard visibility
  console.log(`[API] Search request received at ${new Date().toISOString()}`);

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log(`[API] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ===========================================
    // PARSE AND VALIDATE INPUT
    // ===========================================

    const { location, query, filters, isPremium, language } = req.body as {
      location: Coordinates;
      query: string;
      filters: string[];
      isPremium: boolean;
      language: 'en' | 'ar';
    };

    // Log search details (for Vercel logs)
    console.log(`[API] Search: "${query}" | Premium: ${isPremium} | Language: ${language}`);

    // Validate query
    if (!query || query.trim().length === 0) {
      console.log(`[API] Error: Empty query`);
      return res.status(400).json({ error: 'Search query cannot be empty.' });
    }

    if (query.length > MAX_QUERY_LENGTH) {
      console.log(`[API] Error: Query too long (${query.length} chars)`);
      return res.status(400).json({ error: `Search query too long (max ${MAX_QUERY_LENGTH} characters).` });
    }

    // Validate location
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      console.log(`[API] Error: Invalid location`);
      return res.status(400).json({ error: 'Invalid location coordinates.' });
    }

    // ===========================================
    // CHECK API KEY
    // ===========================================

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('[API] GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'API key not configured on server.' });
    }

    // ===========================================
    // BUILD PROMPT
    // ===========================================

    const prompt = `
    ${language === 'ar' ? `
    ⚠️ CRITICAL LANGUAGE REQUIREMENT - ARABIC ⚠️
    The user interface is in ARABIC. You MUST:
    - Write ALL "pros" themes in Arabic language (translate themes to natural Arabic)
    - Write ALL "cons" themes in Arabic language (translate themes to natural Arabic)
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
    5. Identify the three most common POSITIVE THEMES from the reviews. Summarize what reviewers frequently praise in 1-2 sentences each.
    6. Identify the three most common CONCERNS or NEGATIVE THEMES from the reviews. Summarize what reviewers frequently mention as downsides in 1-2 sentences each.
    7. Extract the official Google Maps star rating and the total number of reviews.
    8. **IMPORTANT: Return only UNIQUE restaurants. Do not include the same restaurant twice, even if it appears multiple times in search results. Each restaurant in your response must be distinct.**

    Return your findings as a VALID JSON array of objects, ordered by your calculated reliable ranking. Each object must have the following keys and data types:
    - "name": string (The full name of the restaurant)
    - "aiRating": number (e.g., 4.7 - your calculated weighted score)
    - "googleRating": number (e.g., 4.5 - the raw Google rating)
    - "googleReviewsCount": number (e.g., 1250)
    - "pros": string[] (An array of exactly 3 common positive themes from reviews)
    - "cons": string[] (An array of exactly 3 common concerns from reviews)

    IMPORTANT: Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON array. The entire response must be only the JSON data. Each pro and con should be a concise summary of a common theme, not a made-up quote.
  `;

    // ===========================================
    // CALL GEMINI API
    // ===========================================

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const modelName = isPremium ? AI_MODEL_NAME : AI_MODEL_NAME_FLASH;

    console.log(`[API] Calling Gemini model: ${modelName}`);

    const makeAPICall = async () => {
      try {
        return await ai.models.generateContent({
          model: modelName,
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
        const errorMessage = error?.message || String(error);
        const errorString = JSON.stringify(error);

        if (error?.status === 429 || error?.code === 429 ||
            errorMessage.includes('429') || errorMessage.includes('quota') ||
            errorMessage.includes('rate limit') || errorString.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('QUOTA_EXCEEDED');
        }

        throw error;
      }
    };

    const response = await retryWithBackoff(makeAPICall);

    // ===========================================
    // EXTRACT TOKEN USAGE
    // ===========================================
    // Gemini SDK returns token counts in usageMetadata
    // We capture this for analytics tracking

    const tokenUsage = {
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
      modelUsed: modelName
    };

    console.log(`[API] Token usage: ${tokenUsage.inputTokens} input, ${tokenUsage.outputTokens} output (${modelName})`);

    // ===========================================
    // PARSE RESPONSE
    // ===========================================

    const cleanedText = cleanJsonString(response.text);
    let parsedRestaurants: Omit<Restaurant, 'mapsUrl' | 'title'>[];

    try {
      parsedRestaurants = JSON.parse(cleanedText);
    } catch (e) {
      console.error('[API] Failed to parse JSON:', cleanedText);
      return res.status(500).json({ error: 'AI returned invalid data format. Please try again.' });
    }

    if (!Array.isArray(parsedRestaurants)) {
      console.error('[API] Response not an array');
      return res.status(500).json({ error: 'AI response was not an array. Please try again.' });
    }

    // ===========================================
    // ENRICH WITH MAPS DATA
    // ===========================================

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsData = new Map<string, { uri: string, title: string }>();

    groundingChunks.forEach((chunk: any) => {
      if (chunk.maps) {
        const normalizedTitle = chunk.maps.title.toLowerCase().trim();
        mapsData.set(normalizedTitle, { uri: chunk.maps.uri, title: chunk.maps.title });
      }
    });

    const enrichedRestaurants: Restaurant[] = [];

    for (const restaurant of parsedRestaurants) {
      const normalizedName = restaurant.name.toLowerCase().trim();
      const mapInfo = mapsData.get(normalizedName);

      if (!mapInfo?.uri) {
        console.warn(`[API] No Maps data for: ${restaurant.name}`);
        // Skip restaurants without Maps data instead of throwing
        continue;
      }

      enrichedRestaurants.push({
        ...restaurant,
        mapsUrl: mapInfo.uri,
        title: mapInfo.title || restaurant.name,
      });
    }

    // ===========================================
    // DEDUPLICATE
    // ===========================================

    const seenUrls = new Map<string, Restaurant>();

    for (const restaurant of enrichedRestaurants) {
      const existing = seenUrls.get(restaurant.mapsUrl);

      if (!existing) {
        seenUrls.set(restaurant.mapsUrl, restaurant);
      } else if (restaurant.googleReviewsCount > existing.googleReviewsCount) {
        seenUrls.set(restaurant.mapsUrl, restaurant);
      }
    }

    const dedupedRestaurants = enrichedRestaurants.filter(r =>
      seenUrls.get(r.mapsUrl) === r
    );

    // ===========================================
    // SUCCESS RESPONSE
    // ===========================================

    console.log(`[API] Success! Found ${dedupedRestaurants.length} restaurants`);

    return res.status(200).json({
      restaurants: dedupedRestaurants,
      count: dedupedRestaurants.length,
      // Token usage for analytics tracking
      tokenUsage
    });

  } catch (error: any) {
    // ===========================================
    // ERROR HANDLING
    // ===========================================

    console.error('[API] Error:', error);

    const errorMessage = error?.message || String(error);

    // Quota exceeded
    if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('429') ||
        errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return res.status(429).json({
        error: 'API rate limit exceeded. Please wait a few minutes and try again.',
        errorType: 'QUOTA_EXCEEDED'
      });
    }

    // API key errors
    if (error?.status === 401 || error?.status === 403 ||
        errorMessage.includes('API key') || errorMessage.includes('unauthorized')) {
      return res.status(401).json({
        error: 'Invalid API key.',
        errorType: 'API_KEY_ERROR'
      });
    }

    // Generic error
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
      errorType: 'UNKNOWN'
    });
  }
}
