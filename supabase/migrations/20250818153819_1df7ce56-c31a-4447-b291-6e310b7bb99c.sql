-- Function to update admin password
CREATE OR REPLACE FUNCTION update_admin_password(user_email text, new_password text)
RETURNS void AS $$
DECLARE
    user_id uuid;
BEGIN
    -- Get user ID from email
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not found with email: %', user_email;
    END IF;
    
    -- Update password using Supabase auth admin functions
    PERFORM auth.update_user(
        user_id,
        jsonb_build_object('password', new_password)
    );
    
    -- Log the action
    INSERT INTO audit_log (user_id, action, table_name, record_id)
    VALUES (user_id, 'password_reset', 'auth.users', user_id::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Temporary function to reset admin password (remove after use)
DO $$
BEGIN
    -- Update password for admin user
    PERFORM update_admin_password('oriparty@ya.ru', 'Ameliya2024');
    
    -- Ensure user has admin role
    UPDATE profiles SET role = 'admin' WHERE id = (
        SELECT id FROM auth.users WHERE email = 'oriparty@ya.ru'
    );
END $$;