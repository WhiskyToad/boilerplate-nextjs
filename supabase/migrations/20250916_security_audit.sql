-- Security and Audit Tables

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  resource_type TEXT,
  resource_id TEXT,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events table (for high-priority security incidents)
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  request_path TEXT,
  request_method TEXT,
  request_headers JSONB,
  response_status INTEGER,
  metadata JSONB,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Failed login attempts tracking
CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempt_count INTEGER DEFAULT 1,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting tracking
CREATE TABLE IF NOT EXISTS rate_limit_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  violation_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  window_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session tracking for security
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  location TEXT, -- Derived from IP
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suspicious activity patterns
CREATE TABLE IF NOT EXISTS suspicious_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL,
  detection_count INTEGER DEFAULT 1,
  first_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);

CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON security_events(ip_address);

CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_email ON failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_ip_address ON failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_last_attempt ON failed_login_attempts(last_attempt_at);

CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_ip_address ON rate_limit_violations(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_endpoint ON rate_limit_violations(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_window_end ON rate_limit_violations(window_end);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_suspicious_patterns_pattern_type ON suspicious_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_suspicious_patterns_is_active ON suspicious_patterns(is_active);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified - any authenticated user can access for now)
CREATE POLICY "Authenticated users can access audit_logs" ON audit_logs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can access security_events" ON security_events
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can access failed_login_attempts" ON failed_login_attempts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can access rate_limit_violations" ON rate_limit_violations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can access suspicious_patterns" ON suspicious_patterns
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Functions for security operations
CREATE OR REPLACE FUNCTION increment_failed_login_attempt(
  attempt_email TEXT,
  attempt_ip INET,
  attempt_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  current_attempts INTEGER := 0;
  block_threshold INTEGER := 5;
  block_duration INTERVAL := '15 minutes';
BEGIN
  -- Get current attempt count
  SELECT attempt_count INTO current_attempts
  FROM failed_login_attempts
  WHERE email = attempt_email AND ip_address = attempt_ip
    AND last_attempt_at > NOW() - INTERVAL '1 hour';

  IF current_attempts IS NULL THEN
    -- First attempt
    INSERT INTO failed_login_attempts (email, ip_address, user_agent)
    VALUES (attempt_email, attempt_ip, attempt_user_agent);
    current_attempts := 1;
  ELSE
    -- Increment attempt count
    current_attempts := current_attempts + 1;
    
    UPDATE failed_login_attempts
    SET 
      attempt_count = current_attempts,
      last_attempt_at = NOW(),
      blocked_until = CASE 
        WHEN current_attempts >= block_threshold 
        THEN NOW() + block_duration 
        ELSE blocked_until 
      END
    WHERE email = attempt_email AND ip_address = attempt_ip;
  END IF;

  RETURN current_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if IP is currently blocked
CREATE OR REPLACE FUNCTION is_ip_blocked(
  check_email TEXT,
  check_ip INET
)
RETURNS BOOLEAN AS $$
DECLARE
  blocked_until_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT blocked_until INTO blocked_until_time
  FROM failed_login_attempts
  WHERE email = check_email AND ip_address = check_ip
    AND blocked_until > NOW();

  RETURN blocked_until_time IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old audit logs (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
  retention_days INTEGER DEFAULT 90
)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 day' * retention_days
    AND severity IN ('low', 'medium');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO audit_logs (
    event_type, action, details, severity, success
  ) VALUES (
    'system.cleanup',
    'audit_log_cleanup',
    jsonb_build_object(
      'deleted_count', deleted_count,
      'retention_days', retention_days
    ),
    'low',
    true
  );

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to detect suspicious patterns
CREATE OR REPLACE FUNCTION detect_suspicious_activity(
  check_ip INET,
  time_window INTERVAL DEFAULT '1 hour',
  threshold INTEGER DEFAULT 100
)
RETURNS BOOLEAN AS $$
DECLARE
  request_count INTEGER;
BEGIN
  -- Count requests from this IP in the time window
  SELECT COUNT(*) INTO request_count
  FROM audit_logs
  WHERE ip_address = check_ip
    AND created_at > NOW() - time_window;

  -- If above threshold, log as suspicious
  IF request_count > threshold THEN
    INSERT INTO suspicious_patterns (
      pattern_type,
      pattern_data,
      detection_count
    ) VALUES (
      'high_request_volume',
      jsonb_build_object(
        'ip_address', check_ip,
        'request_count', request_count,
        'time_window', time_window,
        'threshold', threshold
      ),
      1
    )
    ON CONFLICT (pattern_type, pattern_data) 
    DO UPDATE SET 
      detection_count = suspicious_patterns.detection_count + 1,
      last_detected_at = NOW();

    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT ON audit_logs TO authenticated;
GRANT SELECT, INSERT ON security_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON failed_login_attempts TO authenticated;
GRANT SELECT, INSERT ON rate_limit_violations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO authenticated;
GRANT SELECT, INSERT ON suspicious_patterns TO authenticated;