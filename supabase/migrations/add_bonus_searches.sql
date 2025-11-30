-- ============================================
-- MIGRATION: Add Bonus Searches Feature
-- ============================================
-- Run this in Supabase SQL Editor to add bonus searches
--
-- What this does:
-- 1. Adds bonus_searches column to profiles table
-- 2. Updates get_user_usage function to include bonus
-- 3. Updates increment_search_count to consume bonus after base limit
-- ============================================

-- Step 1: Add column (safe to run multiple times)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bonus_searches INTEGER DEFAULT 0;

-- Step 2: Update increment_search_count function
CREATE OR REPLACE FUNCTION public.increment_search_count(p_user_id UUID)
RETURNS TABLE(search_count INTEGER, is_allowed BOOLEAN) AS $$
DECLARE
  current_month TEXT;
  current_count INTEGER;
  user_is_premium BOOLEAN;
  user_bonus INTEGER;
  base_limit INTEGER;
BEGIN
  -- Get current month in format '2025-01'
  current_month := to_char(NOW(), 'YYYY-MM');

  -- Get user premium status and bonus searches
  SELECT is_premium, COALESCE(bonus_searches, 0)
  INTO user_is_premium, user_bonus
  FROM public.profiles
  WHERE id = p_user_id;

  -- Set base limit (3 for free, 30 for premium)
  base_limit := CASE WHEN user_is_premium THEN 30 ELSE 3 END;

  -- Get current count for this month (default 0)
  SELECT COALESCE(su.search_count, 0) INTO current_count
  FROM public.search_usage su
  WHERE su.user_id = p_user_id AND su.month_year = current_month;

  IF current_count IS NULL THEN
    current_count := 0;
  END IF;

  -- Decide whether to use base allowance or bonus
  IF current_count < base_limit THEN
    -- Use base allowance: increment search_count
    INSERT INTO public.search_usage (user_id, month_year, search_count, last_search_at)
    VALUES (p_user_id, current_month, 1, NOW())
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET
      search_count = search_usage.search_count + 1,
      last_search_at = NOW()
    RETURNING search_usage.search_count INTO current_count;

    RETURN QUERY SELECT current_count, true;

  ELSIF user_bonus > 0 THEN
    -- Base exhausted, use bonus: decrement bonus_searches
    UPDATE public.profiles
    SET bonus_searches = bonus_searches - 1
    WHERE id = p_user_id;

    -- Update last_search_at but don't increment count
    INSERT INTO public.search_usage (user_id, month_year, search_count, last_search_at)
    VALUES (p_user_id, current_month, current_count, NOW())
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET last_search_at = NOW();

    RETURN QUERY SELECT current_count, true;

  ELSE
    -- No base or bonus available
    RETURN QUERY SELECT current_count, false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Step 3: Update get_user_usage function
CREATE OR REPLACE FUNCTION public.get_user_usage(p_user_id UUID)
RETURNS TABLE(
  search_count INTEGER,
  search_limit INTEGER,
  remaining INTEGER,
  is_premium BOOLEAN,
  month_year TEXT
) AS $$
DECLARE
  current_month TEXT;
  current_count INTEGER;
  user_is_premium BOOLEAN;
  user_bonus INTEGER;
  user_limit INTEGER;
BEGIN
  -- Get current month
  current_month := to_char(NOW(), 'YYYY-MM');

  -- Get user premium status and bonus searches
  SELECT profiles.is_premium, COALESCE(profiles.bonus_searches, 0)
  INTO user_is_premium, user_bonus
  FROM public.profiles
  WHERE id = p_user_id;

  -- Set base limit (3 for free, 30 for premium)
  user_limit := CASE WHEN user_is_premium THEN 30 ELSE 3 END;

  -- Get current count (default 0 if no record)
  SELECT COALESCE(su.search_count, 0) INTO current_count
  FROM public.search_usage su
  WHERE su.user_id = p_user_id AND su.month_year = current_month;

  IF current_count IS NULL THEN
    current_count := 0;
  END IF;

  -- Return results
  -- remaining = base remaining + bonus searches
  RETURN QUERY SELECT
    current_count,
    user_limit + user_bonus,  -- Total limit includes bonus
    GREATEST(0, user_limit - current_count) + user_bonus,  -- Remaining = base remaining + bonus
    COALESCE(user_is_premium, false),
    current_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- SUCCESS!
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Bonus searches feature added successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 To gift searches to a user:';
  RAISE NOTICE '   UPDATE profiles SET bonus_searches = 10 WHERE email = ''user@example.com'';';
END $$;
