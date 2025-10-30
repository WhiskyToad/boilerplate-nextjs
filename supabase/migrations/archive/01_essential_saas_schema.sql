-- Essential SaaS Database Schema
-- This migration creates the minimal, essential tables for any SaaS application

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies - users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================================================
-- TEAMS TABLE
-- =============================================================================
-- Core teams functionality for collaboration
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_personal BOOLEAN DEFAULT FALSE, -- True for personal teams
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- TEAM MEMBERS TABLE
-- =============================================================================
-- Junction table for team membership and roles
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS on team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Team members can view team membership" ON team_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM team_members tm 
      WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
    )
  );

-- Teams policies (moved here after team_members table exists)
CREATE POLICY "Team members can view teams" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can update teams" ON teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = teams.id AND user_id = auth.uid() AND role = 'owner'
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

-- =============================================================================
-- USER USAGE TABLE
-- =============================================================================
-- Track usage limits and quotas for each user
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  api_calls_count INTEGER DEFAULT 0,
  teams_count INTEGER DEFAULT 0,
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

-- =============================================================================
-- TEAM INVITES TABLE
-- =============================================================================
-- Handle team invitations
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, email) -- Prevent duplicate invites
);

-- Enable RLS on team_invites
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Team invites policies
CREATE POLICY "Team members can view invites" ON team_invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_id = team_invites.team_id AND user_id = auth.uid()
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
    WHEN 'free' THEN '{"api_calls": 1000, "teams": 1}'::JSON
    WHEN 'pro' THEN '{"api_calls": 10000, "teams": 5}'::JSON  
    WHEN 'teams' THEN '{"api_calls": 100000, "teams": -1}'::JSON
    ELSE '{"api_calls": 1000, "teams": 1}'::JSON
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
  FROM user_subscriptions 
  WHERE user_id = p_user_id;
  
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;
  
  -- Get tier limits
  tier_limits := get_user_tier_limits(user_tier);
  
  -- Get current usage
  SELECT json_build_object(
    'api_calls', api_calls_count,
    'teams', teams_count
  ) INTO current_usage
  FROM user_usage 
  WHERE user_id = p_user_id;
  
  -- Check specific action limits
  CASE p_action
    WHEN 'api_call' THEN
      IF (tier_limits->>'api_calls')::INTEGER = -1 THEN
        RETURN TRUE;
      END IF;
      RETURN (current_usage->>'api_calls')::INTEGER < (tier_limits->>'api_calls')::INTEGER;
    
    WHEN 'create_team' THEN
      IF (tier_limits->>'teams')::INTEGER = -1 THEN
        RETURN TRUE;
      END IF;
      RETURN (current_usage->>'teams')::INTEGER < (tier_limits->>'teams')::INTEGER;
    
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
  
  -- Create personal team
  INSERT INTO public.teams (name, created_by, is_personal)
  VALUES (
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    ) || '''s Team',
    NEW.id,
    TRUE
  );
  
  -- Add user as owner of personal team
  INSERT INTO public.team_members (team_id, user_id, role)
  SELECT id, NEW.id, 'owner'
  FROM public.teams 
  WHERE created_by = NEW.id AND is_personal = TRUE;
  
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
  
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON teams  
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  
CREATE TRIGGER user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  
CREATE TRIGGER user_usage_updated_at BEFORE UPDATE ON user_usage
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON team_invites(email);
CREATE INDEX IF NOT EXISTS idx_team_invites_team_id ON team_invites(team_id);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'Extended user profile information beyond auth.users';
COMMENT ON TABLE teams IS 'Teams for collaboration and organization';
COMMENT ON TABLE team_members IS 'Team membership and roles';
COMMENT ON TABLE user_subscriptions IS 'User subscription status and Stripe integration';
COMMENT ON TABLE user_usage IS 'Track usage quotas and limits';
COMMENT ON TABLE team_invites IS 'Pending team invitations';