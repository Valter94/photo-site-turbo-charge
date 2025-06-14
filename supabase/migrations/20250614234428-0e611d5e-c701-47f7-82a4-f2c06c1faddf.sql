
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
