
-- Включаем RLS для таблицы portfolio если не включено
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если есть
DROP POLICY IF EXISTS "Enable read access for all users" ON public.portfolio;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.portfolio;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.portfolio;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.portfolio;

-- Создаем новые политики которые разрешают публичный доступ к чтению
CREATE POLICY "Allow public read access to portfolio" 
ON public.portfolio FOR SELECT 
USING (true);

-- Разрешаем вставку без проверки аутентификации (для демо)
CREATE POLICY "Allow public insert to portfolio" 
ON public.portfolio FOR INSERT 
WITH CHECK (true);

-- Разрешаем обновление без проверки аутентификации (для демо)  
CREATE POLICY "Allow public update to portfolio" 
ON public.portfolio FOR UPDATE 
USING (true);

-- Разрешаем удаление без проверки аутентификации (для демо)
CREATE POLICY "Allow public delete to portfolio" 
ON public.portfolio FOR DELETE 
USING (true);
