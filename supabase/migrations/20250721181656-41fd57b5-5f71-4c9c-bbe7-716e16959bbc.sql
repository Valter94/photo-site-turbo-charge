-- Update location images with new high-quality photos
UPDATE photoshoot_locations 
SET image_url = '/locations/red-square-new.jpg', updated_at = now()
WHERE name = 'Красная площадь';

UPDATE photoshoot_locations 
SET image_url = '/locations/tsaritsyno-new.jpg', updated_at = now()
WHERE name = 'Музей-усадьба Царицыно';

UPDATE photoshoot_locations 
SET image_url = '/locations/vdnkh-new.jpg', updated_at = now()
WHERE name = 'ВДНХ';

UPDATE photoshoot_locations 
SET image_url = '/locations/vorobyovy-gory-new.jpg', updated_at = now()
WHERE name = 'Воробьевы горы';

UPDATE photoshoot_locations 
SET image_url = '/locations/kolomenskoye-new.jpg', updated_at = now()
WHERE name = 'Музей-заповедник Коломенское';