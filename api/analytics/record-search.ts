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

// ===========================================
// VERCEL GEO HEADERS HELPER
// ===========================================
// Vercel automatically provides geo information in request headers
// This is FREE and doesn't require any external API calls

function getGeoFromHeaders(req: VercelRequest): { city: string | null; country: string | null } {
  // Vercel provides these headers automatically on all requests
  // https://vercel.com/docs/functions/edge-functions/geo
  const cityHeader = req.headers['x-vercel-ip-city'] as string | undefined;
  const countryHeader = req.headers['x-vercel-ip-country'] as string | undefined;

  // City names may be URL-encoded (e.g., "New%20York" -> "New York")
  const city = cityHeader ? decodeURIComponent(cityHeader) : null;
  const country = countryHeader || null;

  return { city, country };
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
    // GET GEO DATA FROM VERCEL HEADERS
    // ===========================================
    // Vercel provides free geo information based on the user's IP
    // This is instant (no external API call) and free!

    const { city, country } = getGeoFromHeaders(req);
    console.log(`[ANALYTICS] Geo from Vercel headers: ${city || 'unknown'}, ${country || 'unknown'}`);

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
