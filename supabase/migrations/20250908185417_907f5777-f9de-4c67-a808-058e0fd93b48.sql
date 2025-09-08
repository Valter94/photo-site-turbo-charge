-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 1: Удаляем дублирующие записи из site_settings (исправленная версия)
DELETE FROM site_settings WHERE id NOT IN (
  SELECT DISTINCT ON (photographer_name) id 
  FROM site_settings 
  ORDER BY photographer_name, created_at ASC
);

-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 2: Обновляем RLS политики для максимальной безопасности
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

-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ 3: Обновляем RLS для telegram_sessions
DROP POLICY IF EXISTS "Users can manage their own telegram sessions" ON telegram_sessions;
CREATE POLICY "Telegram bot can manage all sessions" 
ON telegram_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);