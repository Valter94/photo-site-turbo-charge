-- Fix critical security: Hide email addresses in public reviews
DROP VIEW IF EXISTS public_reviews;

-- Create secure public reviews view without email addresses
CREATE VIEW public_reviews AS 
SELECT 
  id,
  name,
  rating,
  comment,
  service_type,
  photo_url,
  created_at,
  is_approved
FROM reviews 
WHERE is_approved = true;

-- Enable RLS on the view
ALTER VIEW public_reviews SET (security_invoker = true);

-- Update site_settings table to be admin-only for updates
DROP POLICY IF EXISTS "Everyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can delete site settings" ON site_settings;

-- Create new strict policies for site_settings
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update site settings" ON site_settings
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete site settings" ON site_settings
  FOR DELETE USING (is_admin());

-- Create comprehensive site configuration table for full admin control
CREATE TABLE IF NOT EXISTS site_configuration (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  setting_key text NOT NULL,
  setting_value jsonb,
  setting_type text DEFAULT 'text',
  display_name text,
  description text,
  category text DEFAULT 'general',
  is_visible boolean DEFAULT true,
  validation_rules jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(section, setting_key)
);

-- Enable RLS on site_configuration
ALTER TABLE site_configuration ENABLE ROW LEVEL SECURITY;

-- Create policies for site_configuration
CREATE POLICY "Public can view visible site configuration" ON site_configuration
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Only admins can manage site configuration" ON site_configuration
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Insert default site configuration values
INSERT INTO site_configuration (section, setting_key, setting_value, setting_type, display_name, description, category) VALUES
('hero', 'title', '"Профессиональная фотосъемка в Москве"', 'text', 'Заголовок главной страницы', 'Основной заголовок на главной странице', 'content'),
('hero', 'subtitle', '"Создаем незабываемые моменты вашей жизни"', 'text', 'Подзаголовок главной страницы', 'Дополнительный текст под заголовком', 'content'),
('hero', 'background_image', '"/hero-bg.jpg"', 'image', 'Фоновое изображение', 'Главное фоновое изображение', 'media'),
('contact', 'phone', '"+7 (999) 123-45-67"', 'phone', 'Телефон', 'Контактный телефон', 'contact'),
('contact', 'email', '"info@photo-studio.ru"', 'email', 'Email', 'Контактный email', 'contact'),
('contact', 'address', '"Москва, ул. Примерная, д.1"', 'text', 'Адрес', 'Физический адрес студии', 'contact'),
('social', 'instagram', '"https://instagram.com/photographer"', 'url', 'Instagram', 'Ссылка на Instagram', 'social'),
('social', 'vk', '"https://vk.com/photographer"', 'url', 'ВКонтакте', 'Ссылка на ВКонтакте', 'social'),
('social', 'telegram', '"https://t.me/photographer"', 'url', 'Telegram', 'Ссылка на Telegram', 'social'),
('seo', 'meta_title', '"Фотограф в Москве | Профессиональная фотосъемка"', 'text', 'Meta Title', 'SEO заголовок страницы', 'seo'),
('seo', 'meta_description', '"Профессиональный фотограф в Москве. Свадебная, портретная, семейная фотосъемка. Качественные фото, доступные цены."', 'text', 'Meta Description', 'SEO описание страницы', 'seo'),
('seo', 'keywords', '"фотограф москва, фотосъемка, свадебная фотосъемка"', 'text', 'Ключевые слова', 'SEO ключевые слова', 'seo'),
('design', 'primary_color', '"hsl(220, 90%, 56%)"', 'color', 'Основной цвет', 'Главный цвет сайта', 'design'),
('design', 'secondary_color', '"hsl(220, 14.3%, 95.9%)"', 'color', 'Вторичный цвет', 'Дополнительный цвет', 'design'),
('design', 'font_family', '"Inter, system-ui, sans-serif"', 'text', 'Шрифт', 'Основной шрифт сайта', 'design'),
('analytics', 'google_analytics', '""', 'text', 'Google Analytics ID', 'ID для Google Analytics', 'analytics'),
('analytics', 'yandex_metrica', '""', 'text', 'Яндекс.Метрика ID', 'ID для Яндекс.Метрики', 'analytics');

-- Create trigger for updated_at
CREATE TRIGGER update_site_configuration_updated_at
  BEFORE UPDATE ON site_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create admin audit log table for security tracking
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid,
  action text NOT NULL,
  resource text NOT NULL,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  success boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_audit_log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_audit_log
CREATE POLICY "Only admins can view admin audit log" ON admin_audit_log
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action text,
  p_resource text,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL,
  p_success boolean DEFAULT true
) RETURNS void AS $$
BEGIN
  INSERT INTO admin_audit_log (admin_id, action, resource, resource_id, details, success)
  VALUES (auth.uid(), p_action, p_resource, p_resource_id, p_details, p_success);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;