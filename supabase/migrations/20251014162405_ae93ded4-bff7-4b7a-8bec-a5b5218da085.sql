-- Миграция 1: Фиксация фото Ирины
UPDATE site_settings 
SET photographer_photo = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format'
WHERE photographer_photo IS NULL OR photographer_photo = '' OR id IN (SELECT id FROM site_settings LIMIT 1);

-- Миграция 2: Обновление фото московских локаций
UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%красн%площад%' OR LOWER(name) LIKE '%red square%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%воробьев%' OR LOWER(name) LIKE '%воробъев%' OR LOWER(name) LIKE '%sparrow%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%кремл%' OR LOWER(name) LIKE '%kremlin%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%царицын%' OR LOWER(name) LIKE '%tsaritsy%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%коломенск%' OR LOWER(name) LIKE '%kolomensk%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%вднх%' OR LOWER(name) LIKE '%vdnkh%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%горьк%парк%' OR LOWER(name) LIKE '%gorky%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%сокольник%' OR LOWER(name) LIKE '%sokolnik%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%измайлов%' OR LOWER(name) LIKE '%izmailov%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%александр%сад%' OR LOWER(name) LIKE '%alexander%garden%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%арбат%' OR LOWER(name) LIKE '%arbat%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%христ%спасител%' OR LOWER(name) LIKE '%christ%savior%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%василия%блаженн%' OR LOWER(name) LIKE '%basil%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%патриарш%пруд%' OR LOWER(name) LIKE '%patriar%pond%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%москва%сити%' OR LOWER(name) LIKE '%moscow%city%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%зарядь%' OR LOWER(name) LIKE '%zaryadye%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%серебрян%бор%' OR LOWER(name) LIKE '%serebryany%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%битцев%' OR LOWER(name) LIKE '%bitsev%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1512495376558-41c7bb9d35ce?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%кусков%' OR LOWER(name) LIKE '%kuskovo%';

UPDATE photoshoot_locations 
SET image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800&h=600&fit=crop&q=80&auto=format'
WHERE LOWER(name) LIKE '%лужник%' OR LOWER(name) LIKE '%luzhniki%';