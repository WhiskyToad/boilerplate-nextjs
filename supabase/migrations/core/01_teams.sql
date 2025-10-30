-- =============================================================================
-- TEAMS MODULE
-- =============================================================================
-- Add this to enable team collaboration features
-- Requires: 00_base.sql

-- =============================================================================
-- TEAMS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_personal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- TEAM MEMBERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

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

-- Teams policies
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

-- Admins can view all teams
CREATE POLICY "Admins can view all teams" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- TEAM INVITES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, email)
);

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
-- ADD TEAMS SUPPORT TO EXISTING TABLES
-- =============================================================================

-- Add teams_count to user_usage
ALTER TABLE public.user_usage ADD COLUMN IF NOT EXISTS teams_count INTEGER DEFAULT 0;

-- Update tier limits function to include teams
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

-- Update can_user_perform_action to support teams
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
  SELECT tier INTO user_tier
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;

  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;

  tier_limits := get_user_tier_limits(user_tier);

  SELECT json_build_object(
    'api_calls', api_calls_count,
    'teams', teams_count
  ) INTO current_usage
  FROM public.user_usage
  WHERE user_id = p_user_id;

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
-- UPDATE SIGNUP TRIGGER TO CREATE PERSONAL TEAM
-- =============================================================================

-- Replace handle_new_user to include personal team creation
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

  INSERT INTO public.user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');

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

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- updated_at trigger for teams
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON team_invites(email);
CREATE INDEX IF NOT EXISTS idx_team_invites_team_id ON team_invites(team_id);

-- Comments
COMMENT ON TABLE teams IS 'Teams for collaboration and organization';
COMMENT ON TABLE team_members IS 'Team membership and roles';
COMMENT ON TABLE team_invites IS 'Team invitations';
