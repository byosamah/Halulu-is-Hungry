-- ============================================
-- MIGRATION: Add Token Usage Tracking
-- ============================================
-- Extends search_analytics table with token usage data
-- Tracks: input tokens, output tokens, and model used
-- Created: 2025-11-30
-- ============================================

-- Add token usage columns
ALTER TABLE public.search_analytics
ADD COLUMN IF NOT EXISTS input_tokens INTEGER,
ADD COLUMN IF NOT EXISTS output_tokens INTEGER,
ADD COLUMN IF NOT EXISTS model_used TEXT;

-- Add index for model-based queries
CREATE INDEX IF NOT EXISTS idx_search_analytics_model ON search_analytics(model_used);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Token tracking columns added successfully!';
  RAISE NOTICE '📊 New columns: input_tokens, output_tokens, model_used';
  RAISE NOTICE '📈 New index: idx_search_analytics_model';
END $$;
