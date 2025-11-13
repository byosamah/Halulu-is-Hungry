import { GoogleGenAI } from "@google/genai";
import type { Restaurant, Coordinates } from '../types';

const model = "gemini-2.5-flash";

function cleanJsonString(str: string): string {
    // Attempts to remove markdown formatting and extraneous text around a JSON object/array
    const match = str.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    return match ? match[0] : str;
}


export const findRestaurants = async (
  location: Coordinates,
  query: string,
  filters: string[]
): Promise<Restaurant[]> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    // This provides a more user-friendly error in the console.
    console.error("API_KEY environment variable not set. Please ensure your project is configured correctly.");
    throw new Error("API key is not configured. Please contact support.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
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

    Return your findings as a VALID JSON array of objects, ordered by your calculated reliable ranking. Each object must have the following keys and data types:
    - "name": string (The full name of the restaurant)
    - "aiRating": number (e.g., 4.7 - your calculated weighted score)
    - "googleRating": number (e.g., 4.5 - the raw Google rating)
    - "googleReviewsCount": number (e.g., 1250)
    - "pros": string[] (An array of exactly 3 **direct quotes** from positive reviews)
    - "cons": string[] (An array of exactly 3 **direct quotes** from negative reviews)

    IMPORTANT: Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON array. The entire response must be only the JSON data. Each pro and con MUST be a direct quote from a review.
  `;

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

    const cleanedText = cleanJsonString(response.text);
    let parsedRestaurants: Omit<Restaurant, 'mapsUrl' | 'title'>[] = [];
    try {
        parsedRestaurants = JSON.parse(cleanedText);
    } catch(e) {
        console.error("Failed to parse JSON response:", cleanedText);
        throw new Error("AI returned an invalid data format. Please try your search again.");
    }
    
    if(!Array.isArray(parsedRestaurants)) {
        throw new Error("AI response was not an array. Please try again.");
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
      
      return {
        ...restaurant,
        mapsUrl: mapInfo?.uri || '#',
        title: mapInfo?.title || restaurant.name,
      };
    });

    return enrichedRestaurants;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not retrieve data from the AI service.");
  }
};