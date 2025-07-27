-- Phase 1: Create missing security tables
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create user roles enum if not exists
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Create function to log actions
CREATE OR REPLACE FUNCTION public.log_action(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.audit_log (
    user_id, action, table_name, record_id, old_values, new_values
  ) VALUES (
    auth.uid(), p_action, p_table_name, p_record_id, p_old_values, p_new_values
  );
$$;

-- RLS Policies for security_settings (admin only)
CREATE POLICY "Only admins can manage security settings"
ON public.security_settings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- RLS Policies for audit_log (admin only)
CREATE POLICY "Only admins can view audit log"
ON public.audit_log
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "System can insert audit log"
ON public.audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for telegram_sessions (user specific)
CREATE POLICY "Users can manage their own telegram sessions"
ON public.telegram_sessions
FOR ALL
TO authenticated
USING (user_id::TEXT = auth.uid()::TEXT)
WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

-- RLS Policies for additional_services (admin only write, public read)
CREATE POLICY "Everyone can view active additional services"
ON public.additional_services
FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can manage additional services"
ON public.additional_services
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update additional services"
ON public.additional_services
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete additional services"
ON public.additional_services
FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS Policies for site_settings (admin only write, public read)
CREATE POLICY "Everyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage site settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete site settings"
ON public.site_settings
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Insert default security settings
INSERT INTO public.security_settings (setting_key, setting_value, description) VALUES
('max_login_attempts', '5', 'Maximum login attempts before lockout'),
('session_timeout_minutes', '30', 'Session timeout in minutes'),
('require_2fa', 'false', 'Require two-factor authentication'),
('min_password_length', '8', 'Minimum password length'),
('login_lockout_minutes', '15', 'Lockout duration in minutes after max attempts')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();