
-- Создаем bucket для изображений если не существует
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Удаляем старые политики storage если существуют и создаем новые
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for images" ON storage.objects;

-- Создаем RLS политики для storage.objects для bucket images
CREATE POLICY "Public read access for images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Public upload access for images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public update access for images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'images');

CREATE POLICY "Public delete access for images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'images');

-- Обновляем RLS политики для photoshoot_locations
ALTER TABLE public.photoshoot_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to locations" ON public.photoshoot_locations;
DROP POLICY IF EXISTS "Allow public insert to locations" ON public.photoshoot_locations;
DROP POLICY IF EXISTS "Allow public update to locations" ON public.photoshoot_locations;
DROP POLICY IF EXISTS "Allow public delete to locations" ON public.photoshoot_locations;

CREATE POLICY "Allow public read access to locations" 
ON public.photoshoot_locations FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to locations" 
ON public.photoshoot_locations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to locations" 
ON public.photoshoot_locations FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete to locations" 
ON public.photoshoot_locations FOR DELETE 
USING (true);
