-- ============================================
-- MIGRATION: Add Search Analytics Table
-- ============================================
-- This migration creates a table to track individual searches
-- with location data, query, and "Inspire Me" usage
-- Created: 2025-11-30
-- ============================================

-- ============================================
-- TABLE: SEARCH_ANALYTICS
-- ============================================
-- Tracks every individual search for analytics purposes
-- - What users searched for (query)
-- - Where they searched from (city, country, coordinates)
-- - Whether they used "Inspire Me" button
-- - User status at time of search (premium/free)

CREATE TABLE IF NOT EXISTS public.search_analytics (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User reference (required)
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Search details
  search_query TEXT NOT NULL,                    -- What the user searched for
  filters TEXT[] DEFAULT '{}',                   -- Selected filters (e.g., ["Cozy", "Romantic"])
  is_surprise_me BOOLEAN DEFAULT false,          -- Was "Inspire Me" button used?
  language TEXT DEFAULT 'en',                    -- Search language (en/ar)

  -- Location data (from reverse geocoding)
  latitude NUMERIC,                              -- User's latitude
  longitude NUMERIC,                             -- User's longitude
  city TEXT,                                     -- Reverse geocoded city name
  country TEXT,                                  -- Reverse geocoded country name

  -- User status at time of search
  is_premium BOOLEAN DEFAULT false,              -- Was user premium when searching?

  -- Results info
  results_count INTEGER DEFAULT 0,               -- How many restaurants were returned

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
-- Create indexes for common query patterns

-- Query by user (for potential future user history)
CREATE INDEX idx_search_analytics_user_id ON search_analytics(user_id);

-- Query by date range (for time-based analytics)
CREATE INDEX idx_search_analytics_created_at ON search_analytics(created_at);

-- Query by city (for geographic analytics)
CREATE INDEX idx_search_analytics_city ON search_analytics(city);

-- Query by country (for geographic analytics)
CREATE INDEX idx_search_analytics_country ON search_analytics(country);

-- Query by surprise me (for feature usage analytics)
CREATE INDEX idx_search_analytics_surprise_me ON search_analytics(is_surprise_me);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Enable RLS - this table is admin-only
-- Users cannot see this table directly
-- API routes use service_role key which bypasses RLS

ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for regular users
-- This means authenticated users CANNOT access this table
-- Only service_role (used by API routes) can insert data

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ search_analytics table created successfully!';
  RAISE NOTICE '📊 Columns: user_id, search_query, filters, is_surprise_me, language, latitude, longitude, city, country, is_premium, results_count, created_at';
  RAISE NOTICE '🔒 RLS enabled - admin only (service_role access)';
  RAISE NOTICE '📈 Indexes: user_id, created_at, city, country, is_surprise_me';
END $$;
