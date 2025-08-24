-- Fix critical security issues with RLS policies

-- 1. Secure bookings table - only admins and booking owners can view
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete bookings" 
ON public.bookings 
FOR DELETE 
USING (is_admin());

-- 2. Secure reviews table - hide email addresses from public view
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

-- Create view for public reviews without email
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
  id,
  name,
  rating,
  comment,
  service_type,
  photo_url,
  created_at,
  is_approved
FROM public.reviews
WHERE is_approved = true;

-- Grant access to the view
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- Secure the actual reviews table
CREATE POLICY "Only admins can view full reviews with emails" 
ON public.reviews 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Anyone can submit reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update reviews" 
ON public.reviews 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete reviews" 
ON public.reviews 
FOR DELETE 
USING (is_admin());

-- 3. Add MFA settings table for enhanced security
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security settings
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Insert default security settings
INSERT INTO public.security_settings (setting_key, setting_value, description) VALUES
('password_min_length', '8', 'Minimum password length requirement'),
('require_mfa', 'false', 'Require multi-factor authentication for all users'),
('session_timeout_hours', '24', 'Session timeout in hours'),
('max_login_attempts', '5', 'Maximum login attempts before lockout'),
('lockout_duration_minutes', '30', 'Account lockout duration in minutes')
ON CONFLICT (setting_key) DO NOTHING;

-- 4. Create audit log for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security audit log" 
ON public.security_audit_log 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can insert security events" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);