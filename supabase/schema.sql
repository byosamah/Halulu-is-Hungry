-- ============================================
-- HALULU IS HUNGRY - DATABASE SCHEMA
-- ============================================
-- Run this in your Supabase SQL Editor:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor (left sidebar)
-- 4. Paste this entire file
-- 5. Click "Run"
-- ============================================

-- ============================================
-- TABLE 1: PROFILES
-- ============================================
-- Stores user profile data including subscription status
-- Automatically created when a user signs up

CREATE TABLE IF NOT EXISTS public.profiles (
  -- Primary key - matches auth.users.id
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,

  -- Basic info
  email TEXT NOT NULL,
  display_name TEXT,

  -- Avatar (random food emoji + brand color)
  avatar_emoji TEXT NOT NULL DEFAULT '🍕',
  avatar_bg_color TEXT NOT NULL DEFAULT 'coral',

  -- Subscription status
  is_premium BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'free', -- 'free', 'active', 'cancelled', 'expired'
  subscription_id TEXT,                     -- Lemon Squeezy subscription ID
  subscription_variant TEXT,                -- 'monthly' or 'yearly'
  subscription_ends_at TIMESTAMPTZ,         -- When cancelled subscription expires

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow insert for authenticated users (for auto-creation)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ============================================
-- TABLE 2: SEARCH_USAGE
-- ============================================
-- Tracks monthly search usage per user
-- Each row represents one month's usage

CREATE TABLE IF NOT EXISTS public.search_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User reference
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Month tracking (format: '2025-01')
  month_year TEXT NOT NULL,

  -- Usage data
  search_count INTEGER DEFAULT 0,
  last_search_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one row per user per month
  UNIQUE(user_id, month_year)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.search_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own usage
CREATE POLICY "Users can read own usage"
  ON public.search_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own usage
CREATE POLICY "Users can insert own usage"
  ON public.search_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own usage
CREATE POLICY "Users can update own usage"
  ON public.search_usage
  FOR UPDATE
  USING (auth.uid() = user_id);


-- ============================================
-- TABLE 3: WEBHOOK_EVENTS (for Lemon Squeezy)
-- ============================================
-- Stores webhook events for idempotency
-- Prevents processing the same webhook twice

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Event identifier (unique per event)
  event_id TEXT UNIQUE NOT NULL,
  event_name TEXT NOT NULL,

  -- Processing status
  processed BOOLEAN DEFAULT false,

  -- Full payload for debugging
  payload JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SECURITY FIX: Enable RLS for defense-in-depth
-- Edge Functions use service_role key which bypasses RLS anyway
-- But this prevents direct access via anon key
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (Edge Functions use this)
CREATE POLICY IF NOT EXISTS "Service role only"
  ON public.webhook_events
  FOR ALL
  USING (auth.role() = 'service_role');


-- ============================================
-- FUNCTION: Auto-create profile on signup
-- ============================================
-- This function runs automatically when a new user signs up
-- It creates their profile with a random avatar

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  random_emoji TEXT;
  random_color TEXT;
  emojis TEXT[] := ARRAY['🍕', '🍔', '🌮', '🍜', '🍣', '🍱', '🥗', '🍩', '🧁', '🍪', '🥐', '🍳'];
  colors TEXT[] := ARRAY['coral', 'teal', 'yellow', 'pink', 'purple', 'green'];
BEGIN
  -- Pick random emoji and color
  random_emoji := emojis[1 + floor(random() * array_length(emojis, 1))::int];
  random_color := colors[1 + floor(random() * array_length(colors, 1))::int];

  -- Insert profile
  INSERT INTO public.profiles (id, email, display_name, avatar_emoji, avatar_bg_color)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    random_emoji,
    random_color
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Run function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- FUNCTION: Increment search count
-- ============================================
-- Call this function when a user performs a search
-- It creates or updates the monthly usage record

CREATE OR REPLACE FUNCTION public.increment_search_count(p_user_id UUID)
RETURNS TABLE(search_count INTEGER, is_allowed BOOLEAN) AS $$
DECLARE
  current_month TEXT;
  current_count INTEGER;
  user_is_premium BOOLEAN;
  search_limit INTEGER;
BEGIN
  -- Get current month in format '2025-01'
  current_month := to_char(NOW(), 'YYYY-MM');

  -- Check if user is premium
  SELECT is_premium INTO user_is_premium
  FROM public.profiles
  WHERE id = p_user_id;

  -- Set limit based on subscription
  search_limit := CASE WHEN user_is_premium THEN 30 ELSE 3 END;

  -- Insert or update usage record
  INSERT INTO public.search_usage (user_id, month_year, search_count, last_search_at)
  VALUES (p_user_id, current_month, 1, NOW())
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET
    search_count = search_usage.search_count + 1,
    last_search_at = NOW()
  RETURNING search_usage.search_count INTO current_count;

  -- Return results
  RETURN QUERY SELECT current_count, (current_count <= search_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- FUNCTION: Get current usage
-- ============================================
-- Returns the user's current month usage and limits

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
  user_limit INTEGER;
BEGIN
  -- Get current month
  current_month := to_char(NOW(), 'YYYY-MM');

  -- Get user premium status
  SELECT profiles.is_premium INTO user_is_premium
  FROM public.profiles
  WHERE id = p_user_id;

  -- Set limit
  user_limit := CASE WHEN user_is_premium THEN 30 ELSE 3 END;

  -- Get current count (default 0 if no record)
  SELECT COALESCE(su.search_count, 0) INTO current_count
  FROM public.search_usage su
  WHERE su.user_id = p_user_id AND su.month_year = current_month;

  IF current_count IS NULL THEN
    current_count := 0;
  END IF;

  -- Return results
  RETURN QUERY SELECT
    current_count,
    user_limit,
    GREATEST(0, user_limit - current_count),
    COALESCE(user_is_premium, false),
    current_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If you see this, everything ran successfully!

DO $$
BEGIN
  RAISE NOTICE '✅ Halulu database schema created successfully!';
  RAISE NOTICE '📊 Tables: profiles, search_usage, webhook_events';
  RAISE NOTICE '🔧 Functions: handle_new_user, increment_search_count, get_user_usage';
  RAISE NOTICE '🔒 RLS policies enabled';
END $$;
