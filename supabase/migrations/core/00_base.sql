-- =============================================================================
-- CORE BASE SCHEMA
-- =============================================================================
-- This is the foundation for all SaaS apps
-- Includes: profiles, subscriptions, usage tracking, and basic auth triggers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USER PROFILES TABLE
-- =============================================================================
-- Extends Supabase auth.users with additional profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies - users can see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- USER SUBSCRIPTIONS TABLE
-- =============================================================================
-- Track user subscription status and Stripe integration
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free', -- free, pro, teams
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_interval TEXT, -- monthly, annual
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription policies - users can only see their own subscription
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- USER USAGE TABLE
-- =============================================================================
-- Track usage limits and quotas for each user
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  api_calls_count INTEGER DEFAULT 0,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_usage
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Usage policies - users can only see their own usage
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage" ON user_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to get user tier limits
CREATE OR REPLACE FUNCTION get_user_tier_limits(user_tier TEXT)
RETURNS JSON AS $$
BEGIN
  RETURN CASE user_tier
    WHEN 'free' THEN '{"api_calls": 1000}'::JSON
    WHEN 'pro' THEN '{"api_calls": 10000}'::JSON
    WHEN 'teams' THEN '{"api_calls": 100000}'::JSON
    ELSE '{"api_calls": 1000}'::JSON
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can perform action
CREATE OR REPLACE FUNCTION can_user_perform_action(
  p_user_id UUID,
  p_action TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  current_usage JSON;
  tier_limits JSON;
BEGIN
  -- Get user's current tier
  SELECT tier INTO user_tier
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;

  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;

  -- Get tier limits
  tier_limits := get_user_tier_limits(user_tier);

  -- Get current usage
  SELECT json_build_object(
    'api_calls', api_calls_count
  ) INTO current_usage
  FROM public.user_usage
  WHERE user_id = p_user_id;

  -- Check specific action limits
  CASE p_action
    WHEN 'api_call' THEN
      IF (tier_limits->>'api_calls')::INTEGER = -1 THEN
        RETURN TRUE;
      END IF;
      RETURN (current_usage->>'api_calls')::INTEGER < (tier_limits->>'api_calls')::INTEGER;

    ELSE
      RETURN TRUE;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  );

  -- Create initial subscription record
  INSERT INTO public.user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');

  -- Create initial usage record
  INSERT INTO public.user_usage (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger to update updated_at column
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER user_usage_updated_at BEFORE UPDATE ON user_usage
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'Extended user profile information beyond auth.users';
COMMENT ON TABLE user_subscriptions IS 'User subscription status and Stripe integration';
COMMENT ON TABLE user_usage IS 'Track usage quotas and limits';
