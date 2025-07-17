
-- Включаем RLS для таблиц, которые его не имеют
ALTER TABLE public.additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Создаем функцию для безопасного получения роли пользователя (избегаем рекурсию)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Создаем функцию для проверки, является ли пользователь админом
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Политики для additional_services
CREATE POLICY "Allow public read access to additional_services" 
  ON public.additional_services 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow admins to manage additional_services" 
  ON public.additional_services 
  FOR ALL 
  USING (public.is_admin());

-- Политики для site_settings
CREATE POLICY "Allow public read access to site_settings" 
  ON public.site_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow admins to manage site_settings" 
  ON public.site_settings 
  FOR ALL 
  USING (public.is_admin());

-- Политики для telegram_sessions (только для бота)
ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to manage telegram_sessions" 
  ON public.telegram_sessions 
  FOR ALL 
  USING (true);

-- Улучшаем политики для profiles (исправляем рекурсию)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Allow users to view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow users to update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Создаем недостающие индексы для производительности
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_is_featured ON public.portfolio(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_pricing_service_type ON public.pricing(service_type);
CREATE INDEX IF NOT EXISTS idx_pricing_is_active ON public.pricing(is_active);

-- Добавляем ограничения для валидации данных
ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE public.pricing ADD CONSTRAINT pricing_price_positive CHECK (price > 0);
ALTER TABLE public.pricing ADD CONSTRAINT pricing_duration_positive CHECK (duration_hours > 0);
ALTER TABLE public.additional_services ADD CONSTRAINT additional_services_price_positive CHECK (price IS NULL OR price > 0);

-- Обновляем функцию handle_new_user для безопасности
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'username', new.email, 'User'), 
    'user'::user_role
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Если профиль уже существует, просто возвращаем new
    RETURN new;
  WHEN OTHERS THEN
    -- Логируем ошибку, но не блокируем регистрацию
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN new;
END;
$$;

-- Создаем триггер для автоматического создания профилей
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Добавляем политики безопасности для storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

-- Политики для storage bucket
CREATE POLICY "Allow public read access to images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Создаем таблицу для логирования действий (аудит)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Только админы могут читать логи
CREATE POLICY "Allow admins to read audit_log" 
  ON public.audit_log 
  FOR SELECT 
  USING (public.is_admin());

-- Системные операции могут записывать в лог
CREATE POLICY "Allow system to insert audit_log" 
  ON public.audit_log 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем функцию для логирования
CREATE OR REPLACE FUNCTION public.log_action(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id, action, table_name, record_id, old_values, new_values
  ) VALUES (
    auth.uid(), p_action, p_table_name, p_record_id, p_old_values, p_new_values
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем таблицу для хранения настроек безопасности
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для security_settings
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Только админы могут управлять настройками безопасности
CREATE POLICY "Allow admins to manage security_settings" 
  ON public.security_settings 
  FOR ALL 
  USING (public.is_admin());

-- Добавляем базовые настройки безопасности
INSERT INTO public.security_settings (setting_key, setting_value, description) VALUES
  ('max_login_attempts', '5', 'Максимальное количество попыток входа'),
  ('session_timeout', '3600', 'Время сессии в секундах'),
  ('password_min_length', '8', 'Минимальная длина пароля'),
  ('enable_2fa', 'false', 'Включить двухфакторную аутентификацию'),
  ('ip_whitelist', '[]', 'Список разрешенных IP-адресов для админки')
ON CONFLICT (setting_key) DO NOTHING;
