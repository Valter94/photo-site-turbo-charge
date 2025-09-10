-- Fix security warning: Function Search Path Mutable
-- Update functions to have secure search_path

ALTER FUNCTION update_system_settings_updated_at() SET search_path = public;
ALTER FUNCTION log_admin_action(text, text, text, jsonb, boolean) SET search_path = public;
ALTER FUNCTION handle_new_user() SET search_path = public;
ALTER FUNCTION update_updated_at_column() SET search_path = public;
ALTER FUNCTION is_admin(uuid) SET search_path = public;
ALTER FUNCTION log_action(text, text, text, jsonb, jsonb) SET search_path = public;