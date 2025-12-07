-- =============================================================================
-- OPTIONAL: WAITLIST MODULE
-- =============================================================================
-- Collect early-access signups before launch

CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  note TEXT,
  source TEXT, -- marketing source or landing page variant
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'joined')),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Allow public/anon + authenticated users to join the waitlist
CREATE POLICY "Anyone can join the waitlist" ON waitlist_entries
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'authenticated'));

-- Admins can view all waitlist entries
CREATE POLICY "Admins can view waitlist" ON waitlist_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage waitlist entries
CREATE POLICY "Admins can update waitlist" ON waitlist_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete waitlist" ON waitlist_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
