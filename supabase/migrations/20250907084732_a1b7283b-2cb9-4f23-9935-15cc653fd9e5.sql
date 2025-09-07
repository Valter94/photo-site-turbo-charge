-- Fix function search path security issue
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action text,
  p_resource text,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL,
  p_success boolean DEFAULT true
) RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO admin_audit_log (admin_id, action, resource, resource_id, details, success)
  VALUES (auth.uid(), p_action, p_resource, p_resource_id, p_details, p_success);
END;
$$;