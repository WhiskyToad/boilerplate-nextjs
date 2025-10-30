-- =============================================================================
-- ADMIN MODULE
-- =============================================================================
-- Adds admin activity logging and enhanced admin capabilities
-- Requires: 00_base.sql (uses profiles.role)

-- =============================================================================
-- ADMIN ACTIVITY LOGGING
-- =============================================================================
CREATE TABLE IF NOT EXISTS admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin activity
CREATE POLICY "Admins can view admin activity" ON admin_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert admin activity
CREATE POLICY "Admins can insert admin activity" ON admin_activity
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- ADMIN VIEWS
-- =============================================================================

-- Enhanced profile view with auth metadata
CREATE OR REPLACE VIEW profiles_with_auth AS
SELECT
  p.*,
  u.last_sign_in_at,
  u.email_confirmed_at,
  u.created_at as auth_created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id;

-- Grant permissions
GRANT SELECT ON profiles_with_auth TO authenticated;

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity(action);

-- Comments
COMMENT ON TABLE admin_activity IS 'Logs actions performed by admin users';
COMMENT ON VIEW profiles_with_auth IS 'Combines profile data with auth metadata';
