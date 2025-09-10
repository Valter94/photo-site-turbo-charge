-- ЭТАП 1: ЭКСТРЕННЫЕ ИСПРАВЛЕНИЯ (исправленная версия)

-- 1.1 Удалить старую запись site_settings (оставляем более новую)
DELETE FROM site_settings 
WHERE id = '5d6d9076-cd15-4680-b2cb-963d55cf8b36';

-- 1.2 Исправить критические RLS политики

-- Защитить emails в reviews от публичного доступа
DROP POLICY IF EXISTS "Public can view approved reviews without emails" ON reviews;
CREATE POLICY "Public can view approved reviews without emails" 
ON reviews FOR SELECT 
USING (is_approved = true);

-- Убедиться что только админы могут редактировать portfolio
DROP POLICY IF EXISTS "Only admins can manage portfolio" ON portfolio;
CREATE POLICY "Only admins can manage portfolio" 
ON portfolio FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Защитить locations от публичного изменения
DROP POLICY IF EXISTS "Only admins can manage locations" ON photoshoot_locations;
CREATE POLICY "Only admins can manage locations" 
ON photoshoot_locations FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- 1.3 Создать таблицы для enhanced админ панели

-- Таблица для системных настроек
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_category TEXT NOT NULL, -- 'general', 'seo', 'appearance', 'contact'
    setting_key TEXT NOT NULL,
    setting_value JSONB,
    display_name TEXT,
    description TEXT,
    setting_type TEXT DEFAULT 'text', -- 'text', 'textarea', 'color', 'image', 'boolean'
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(setting_category, setting_key)
);

-- RLS для system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage system settings" 
ON system_settings FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Public can view visible system settings" 
ON system_settings FOR SELECT 
USING (is_visible = true);

-- Таблица для backup конфигураций
CREATE TABLE IF NOT EXISTS config_backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_name TEXT NOT NULL,
    backup_data JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    description TEXT
);

-- RLS для config_backups
ALTER TABLE config_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage config backups" 
ON config_backups FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Создать функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создать триггер для system_settings
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_system_settings_updated_at();

-- Добавить базовые настройки
INSERT INTO system_settings (setting_category, setting_key, setting_value, display_name, description, setting_type) VALUES 
('general', 'site_title', '"Профессиональная фотография"', 'Название сайта', 'Главный заголовок сайта', 'text'),
('general', 'site_description', '"Запечатлеваю моменты, которые останутся с вами навсегда"', 'Описание сайта', 'Краткое описание для поисковиков', 'textarea'),
('seo', 'meta_keywords', '"фотограф москва, свадебная фотосъемка, love story, портретная съемка"', 'Ключевые слова', 'SEO ключевые слова', 'textarea'),
('seo', 'google_analytics', '""', 'Google Analytics ID', 'ID для Google Analytics', 'text'),
('appearance', 'primary_color', '"#8B5CF6"', 'Основной цвет', 'Главный цвет бренда', 'color'),
('appearance', 'secondary_color', '"#06B6D4"', 'Дополнительный цвет', 'Вторичный цвет', 'color'),
('contact', 'show_whatsapp', 'true', 'Показать WhatsApp', 'Отображать кнопку WhatsApp', 'boolean'),
('contact', 'whatsapp_number', '"+79261234567"', 'Номер WhatsApp', 'Номер для WhatsApp', 'text')
ON CONFLICT (setting_category, setting_key) DO NOTHING;