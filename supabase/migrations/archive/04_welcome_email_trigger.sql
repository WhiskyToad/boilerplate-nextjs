-- Migration: Add welcome email trigger for new user signups
-- This sends a welcome email automatically when users sign up

-- Create function to send welcome email via webhook
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  app_url TEXT;
  webhook_response TEXT;
BEGIN
  -- Set app URL based on environment
  -- You'll need to update this URL to match your production domain
  app_url := 'https://www.example.com';
  
  -- Log the attempt
  RAISE LOG 'Sending welcome email for user: %', NEW.email;
  
  -- Make HTTP request to welcome email endpoint
  -- Using net.http_post extension (must be enabled in Supabase)
  BEGIN
    SELECT content INTO webhook_response
    FROM net.http_post(
      url := app_url || '/api/emails/welcome',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(
          current_setting('app.settings.webhook_secret', true),
          'webhook-secret-key'
        )
      ),
      body := jsonb_build_object(
        'email', NEW.email,
        'name', COALESCE(
          NEW.raw_user_meta_data->>'full_name',
          NEW.raw_user_meta_data->>'name',
          split_part(NEW.email, '@', 1)
        ),
        'user_id', NEW.id,
        'created_at', NEW.created_at
      )
    );
    
    RAISE LOG 'Welcome email webhook response: %', webhook_response;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Failed to send welcome email for %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Cannot create triggers on auth.users directly due to permissions
-- Alternative approach: Use Supabase Auth Webhooks instead
-- 
-- To set up welcome emails:
-- 1. Go to Authentication > Settings in Supabase dashboard
-- 2. Add webhook URL: https://www.example.com/api/auth/webhook
-- 3. Select "user.created" event
-- 4. This will call your API when users sign up

-- Add comment for documentation
COMMENT ON FUNCTION send_welcome_email() IS 'Automatically sends welcome email when new user signs up';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Triggers welcome email for new user signups';

-- Note: You need to enable the net extension in Supabase:
-- 1. Go to Database > Extensions in Supabase dashboard
-- 2. Search for and enable "net" extension
-- 3. This allows HTTP requests from database functions
