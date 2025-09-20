-- DemoFlow Database Schema (Simplified)
-- This migration adds core tables for DemoFlow demo functionality
-- Requires: 01_essential_saas_schema.sql

-- =============================================================================
-- DEMOS TABLE
-- =============================================================================
-- Core demos table for storing demo metadata and settings
CREATE TABLE IF NOT EXISTS demos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  recording_data JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  brand_settings JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  total_steps INTEGER DEFAULT 0,
  estimated_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on demos
ALTER TABLE demos ENABLE ROW LEVEL SECURITY;

-- Simplified demos policies - users can only access their own demos
CREATE POLICY "Users can view own demos" ON demos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create demos" ON demos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own demos" ON demos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own demos" ON demos
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- DEMO STEPS TABLE
-- =============================================================================
-- Individual steps within a demo recording
CREATE TABLE IF NOT EXISTS demo_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  demo_id UUID REFERENCES demos(id) ON DELETE CASCADE NOT NULL,
  sequence_order INTEGER NOT NULL,
  step_type TEXT NOT NULL DEFAULT 'interaction', -- interaction, annotation, pause
  element_data JSONB NOT NULL DEFAULT '{}',
  annotations JSONB DEFAULT '{}',
  interactions JSONB DEFAULT '{}',
  screenshot_url TEXT,
  dom_snapshot JSONB,
  timing_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(demo_id, sequence_order)
);

-- Enable RLS on demo_steps
ALTER TABLE demo_steps ENABLE ROW LEVEL SECURITY;

-- Simplified demo steps policies - inherit from parent demo ownership
CREATE POLICY "Users can access steps from own demos" ON demo_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM demos d
      WHERE d.id = demo_steps.demo_id AND d.user_id = auth.uid()
    )
  );

-- =============================================================================
-- DEMO ANALYTICS TABLE
-- =============================================================================
-- Track demo views and interactions for analytics
CREATE TABLE IF NOT EXISTS demo_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  demo_id UUID REFERENCES demos(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- view_start, step_complete, demo_complete, demo_exit, interaction_click
  event_data JSONB DEFAULT '{}',
  step_id UUID REFERENCES demo_steps(id) ON DELETE SET NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  country_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on demo_analytics
ALTER TABLE demo_analytics ENABLE ROW LEVEL SECURITY;

-- Simplified analytics policies
CREATE POLICY "Demo owners can view analytics" ON demo_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM demos d
      WHERE d.id = demo_analytics.demo_id AND d.user_id = auth.uid()
    )
  );

-- Analytics can be inserted by anyone (public demo viewers)
CREATE POLICY "Anyone can insert analytics" ON demo_analytics
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- DEMO SHARES TABLE
-- =============================================================================
-- Manage public sharing and access controls for demos
CREATE TABLE IF NOT EXISTS demo_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  demo_id UUID REFERENCES demos(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  password_hash TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  allow_embedding BOOLEAN DEFAULT TRUE,
  custom_domain TEXT,
  view_count INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on demo_shares
ALTER TABLE demo_shares ENABLE ROW LEVEL SECURITY;

-- Simplified share policies - only demo owners can manage shares
CREATE POLICY "Demo owners can manage shares" ON demo_shares
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM demos d
      WHERE d.id = demo_shares.demo_id AND d.user_id = auth.uid()
    )
  );

-- =============================================================================
-- DEMO TEMPLATES TABLE (SIMPLIFIED)
-- =============================================================================
-- Store basic demo templates for quick creation
CREATE TABLE IF NOT EXISTS demo_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on demo_templates
ALTER TABLE demo_templates ENABLE ROW LEVEL SECURITY;

-- Simplified template policies
CREATE POLICY "Anyone can view public templates" ON demo_templates
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can view own templates" ON demo_templates
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create templates" ON demo_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON demo_templates
  FOR UPDATE USING (created_by = auth.uid());

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update step count when steps are added/removed
CREATE OR REPLACE FUNCTION update_demo_step_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE demos 
  SET total_steps = (
    SELECT COUNT(*) 
    FROM demo_steps 
    WHERE demo_id = COALESCE(NEW.demo_id, OLD.demo_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.demo_id, OLD.demo_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to track demo views and update share stats
CREATE OR REPLACE FUNCTION track_demo_view()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track actual views (not other events)
  IF NEW.event_type = 'view_start' THEN
    -- Update share view count
    UPDATE demo_shares 
    SET view_count = view_count + 1,
        last_viewed_at = NOW(),
        updated_at = NOW()
    WHERE demo_id = NEW.demo_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to update step count when steps are added/removed
CREATE TRIGGER demo_step_count_trigger
  AFTER INSERT OR DELETE ON demo_steps
  FOR EACH ROW EXECUTE FUNCTION update_demo_step_count();

-- Trigger to track demo analytics
CREATE TRIGGER track_demo_analytics_trigger
  AFTER INSERT ON demo_analytics
  FOR EACH ROW EXECUTE FUNCTION track_demo_view();

-- Apply updated_at triggers to new tables
CREATE TRIGGER demos_updated_at BEFORE UPDATE ON demos
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER demo_steps_updated_at BEFORE UPDATE ON demo_steps
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER demo_shares_updated_at BEFORE UPDATE ON demo_shares
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER demo_templates_updated_at BEFORE UPDATE ON demo_templates
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Demos indexes
CREATE INDEX IF NOT EXISTS idx_demos_user_id ON demos(user_id);
CREATE INDEX IF NOT EXISTS idx_demos_status ON demos(status);
CREATE INDEX IF NOT EXISTS idx_demos_created_at ON demos(created_at DESC);

-- Demo steps indexes
CREATE INDEX IF NOT EXISTS idx_demo_steps_demo_id ON demo_steps(demo_id);
CREATE INDEX IF NOT EXISTS idx_demo_steps_sequence ON demo_steps(demo_id, sequence_order);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_demo_analytics_demo_id ON demo_analytics(demo_id);
CREATE INDEX IF NOT EXISTS idx_demo_analytics_session ON demo_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_demo_analytics_event_type ON demo_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_demo_analytics_created_at ON demo_analytics(created_at DESC);

-- Shares indexes
CREATE INDEX IF NOT EXISTS idx_demo_shares_demo_id ON demo_shares(demo_id);
CREATE INDEX IF NOT EXISTS idx_demo_shares_token ON demo_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_demo_shares_active ON demo_shares(is_active) WHERE is_active = true;

-- Templates indexes
CREATE INDEX IF NOT EXISTS idx_demo_templates_public ON demo_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_demo_templates_category ON demo_templates(category);
CREATE INDEX IF NOT EXISTS idx_demo_templates_created_by ON demo_templates(created_by);

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE demos IS 'Core table for storing interactive demo metadata and settings';
COMMENT ON TABLE demo_steps IS 'Individual steps and interactions within a demo recording';
COMMENT ON TABLE demo_analytics IS 'Analytics events for demo views and interactions';
COMMENT ON TABLE demo_shares IS 'Public sharing configuration and access controls for demos';
COMMENT ON TABLE demo_templates IS 'Reusable demo templates for quick creation';

COMMENT ON COLUMN demos.recording_data IS 'Raw recording data from Chrome extension';
COMMENT ON COLUMN demos.settings IS 'Demo-specific settings (navigation, timing, etc)';
COMMENT ON COLUMN demos.brand_settings IS 'Brand customization (colors, logos, etc)';
COMMENT ON COLUMN demo_steps.element_data IS 'DOM element data and positioning';
COMMENT ON COLUMN demo_steps.annotations IS 'Step annotations, tooltips, and highlights';
COMMENT ON COLUMN demo_steps.interactions IS 'Interactive element configuration';
COMMENT ON COLUMN demo_shares.share_token IS 'Unique token for public demo access';