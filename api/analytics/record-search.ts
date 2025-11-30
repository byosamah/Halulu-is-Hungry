// ===========================================
// VERCEL API ROUTE: /api/analytics/record-search
// Records search analytics with reverse geocoding
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ===========================================
// TYPES
// ===========================================

interface SearchAnalyticsRequest {
  userId: string;
  query: string;
  latitude: number;
  longitude: number;
  filters: string[];
  isSurpriseMe: boolean;
  isPremium: boolean;
  language: 'en' | 'ar';
  resultsCount: number;
  // Token usage tracking
  inputTokens?: number;
  outputTokens?: number;
  modelUsed?: string;
}

interface GeocodingResult {
  city: string | null;
  country: string | null;
}

// ===========================================
// REVERSE GEOCODING HELPER
// ===========================================
// Uses Google Geocoding API to get city/country from coordinates

async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
  try {
    // Use the same API key as Gemini (Google Cloud API key)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('[ANALYTICS] No API key, skipping geocoding');
      return { city: null, country: null };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=en`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.log(`[ANALYTICS] Geocoding failed: ${data.status}`);
      return { city: null, country: null };
    }

    // Parse the address components to find city and country
    let city: string | null = null;
    let country: string | null = null;

    // Google returns results from most specific to least specific
    // We'll check the first result's address components
    const addressComponents = data.results[0].address_components;

    for (const component of addressComponents) {
      const types = component.types;

      // City can be: locality, administrative_area_level_1, or sublocality
      if (!city) {
        if (types.includes('locality')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          // Use admin area if no locality (for some regions)
          city = component.long_name;
        }
      }

      // Country
      if (types.includes('country')) {
        country = component.long_name;
      }
    }

    console.log(`[ANALYTICS] Geocoded: ${city}, ${country}`);
    return { city, country };

  } catch (error) {
    console.error('[ANALYTICS] Geocoding error:', error);
    return { city: null, country: null };
  }
}

// ===========================================
// MAIN HANDLER
// ===========================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[ANALYTICS] Record search request at ${new Date().toISOString()}`);

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract data from request body
    const {
      userId,
      query,
      latitude,
      longitude,
      filters,
      isSurpriseMe,
      isPremium,
      language,
      resultsCount,
      // Token usage tracking
      inputTokens,
      outputTokens,
      modelUsed
    } = req.body as SearchAnalyticsRequest;

    // ===========================================
    // VALIDATION
    // ===========================================
    // We require userId and query at minimum

    if (!userId) {
      console.log('[ANALYTICS] Missing userId, skipping');
      return res.status(400).json({ error: 'User ID required' });
    }

    if (!query) {
      console.log('[ANALYTICS] Missing query, skipping');
      return res.status(400).json({ error: 'Query required' });
    }

    // ===========================================
    // REVERSE GEOCODE
    // ===========================================
    // Get city and country from coordinates
    // This adds ~100-200ms but provides valuable location data

    let city: string | null = null;
    let country: string | null = null;

    if (latitude && longitude) {
      const geoResult = await reverseGeocode(latitude, longitude);
      city = geoResult.city;
      country = geoResult.country;
    }

    // ===========================================
    // INSERT INTO DATABASE
    // ===========================================
    // Use service role to bypass RLS (users can't access this table)

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertError } = await supabase
      .from('search_analytics')
      .insert({
        user_id: userId,
        search_query: query,
        filters: filters || [],
        is_surprise_me: isSurpriseMe || false,
        language: language || 'en',
        latitude: latitude || null,
        longitude: longitude || null,
        city,
        country,
        is_premium: isPremium || false,
        results_count: resultsCount || 0,
        // Token usage tracking
        input_tokens: inputTokens || null,
        output_tokens: outputTokens || null,
        model_used: modelUsed || null
      });

    if (insertError) {
      console.error('[ANALYTICS] Insert error:', insertError.message);
      // Don't fail the request - analytics shouldn't break the app
      return res.status(200).json({
        success: false,
        error: insertError.message
      });
    }

    console.log(`[ANALYTICS] Recorded search: "${query}" from ${city || 'unknown'}, ${country || 'unknown'} | model: ${modelUsed || 'unknown'} | tokens: ${inputTokens || 0}/${outputTokens || 0} | surprise_me: ${isSurpriseMe}`);

    return res.status(200).json({ success: true });

  } catch (error: any) {
    // Log but don't fail - analytics should be non-blocking
    console.error('[ANALYTICS] Unexpected error:', error);
    return res.status(200).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  }
}
