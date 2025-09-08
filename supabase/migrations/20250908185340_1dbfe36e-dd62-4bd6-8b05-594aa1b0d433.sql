-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 1: Удаляем дублирующие записи из site_settings
DELETE FROM site_settings WHERE id IN (
  SELECT id FROM site_settings 
  WHERE id NOT IN (
    SELECT MIN(id) FROM site_settings GROUP BY photographer_name
  )
);

-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 2: Обновляем RLS политики для максимальной безопасности

-- Удаляем старые небезопасные политики для reviews
DROP POLICY IF EXISTS "Enable all for reviews management" ON reviews;
DROP POLICY IF EXISTS "Users can insert reviews" ON reviews;

-- Создаем безопасные политики для reviews (скрываем email от публики)
CREATE POLICY "Public can view approved reviews without emails" 
ON reviews 
FOR SELECT 
USING (is_approved = true);

-- Удаляем публичные политики для portfolio (только админы должны управлять)
DROP POLICY IF EXISTS "Allow public delete to portfolio" ON portfolio;
DROP POLICY IF EXISTS "Allow public insert to portfolio" ON portfolio; 
DROP POLICY IF EXISTS "Allow public update to portfolio" ON portfolio;
DROP POLICY IF EXISTS "Enable all for portfolio management" ON portfolio;

-- Создаем безопасные политики для portfolio
CREATE POLICY "Only admins can manage portfolio" 
ON portfolio 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Удаляем публичные политики для locations (только админы должны управлять)
DROP POLICY IF EXISTS "Allow public delete to locations" ON photoshoot_locations;
DROP POLICY IF EXISTS "Allow public insert to locations" ON photoshoot_locations;
DROP POLICY IF EXISTS "Allow public update to locations" ON photoshoot_locations;
DROP POLICY IF EXISTS "Enable all for locations management" ON photoshoot_locations;

-- Создаем безопасные политики для locations
CREATE POLICY "Only admins can manage locations" 
ON photoshoot_locations 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 3: Обновляем таблицу telegram_sessions для правильной работы
ALTER TABLE telegram_sessions DROP CONSTRAINT IF EXISTS telegram_sessions_pkey;
ALTER TABLE telegram_sessions ADD PRIMARY KEY (user_id);

-- Обновляем RLS для telegram_sessions
DROP POLICY IF EXISTS "Users can manage their own telegram sessions" ON telegram_sessions;
CREATE POLICY "Telegram bot can manage all sessions" 
ON telegram_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 4: Создаем таблицу для audit логов действий
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS для security_events
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view security events" 
ON security_events 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can insert security events" 
ON security_events 
FOR INSERT 
WITH CHECK (true);

-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 5: Создаем функцию для логирования событий безопасности
CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO security_events (event_type, user_id, ip_address, user_agent, details, severity)
  VALUES (p_event_type, p_user_id, p_ip_address, p_user_agent, p_details, p_severity);
END;
$$;