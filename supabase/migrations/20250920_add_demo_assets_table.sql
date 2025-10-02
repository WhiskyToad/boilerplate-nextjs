-- Create demo_assets table for storing file uploads
CREATE TABLE demo_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id UUID REFERENCES demos(id) ON DELETE CASCADE,
  step_id UUID REFERENCES demo_steps(id) ON DELETE SET NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('screenshot', 'dom_snapshot', 'video')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  public_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_demo_assets_demo_id ON demo_assets(demo_id);
CREATE INDEX idx_demo_assets_step_id ON demo_assets(step_id);
CREATE INDEX idx_demo_assets_type ON demo_assets(asset_type);

-- Enable RLS
ALTER TABLE demo_assets ENABLE ROW LEVEL SECURITY;

-- RLS policies for demo_assets
CREATE POLICY "Users can view own demo assets" ON demo_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM demos 
      WHERE demos.id = demo_assets.demo_id 
      AND demos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own demo assets" ON demo_assets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM demos 
      WHERE demos.id = demo_assets.demo_id 
      AND demos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own demo assets" ON demo_assets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM demos 
      WHERE demos.id = demo_assets.demo_id 
      AND demos.user_id = auth.uid()
    )
  );