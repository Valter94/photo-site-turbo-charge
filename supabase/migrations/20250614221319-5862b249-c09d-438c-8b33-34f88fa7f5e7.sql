
-- Добавляем настройки сайта с вашим фото и описанием
INSERT INTO site_settings (
  photographer_name,
  photographer_description,
  photographer_photo,
  hero_title,
  hero_subtitle,
  contact_email,
  contact_phone,
  contact_address
) VALUES (
  'Ирина',
  'Профессиональный фотограф с 5+ летним опытом. Специализируюсь на свадебной, семейной фотографии и love story съемках. Каждая фотосессия для меня - это возможность запечатлеть самые важные и искренние моменты вашей жизни.',
  'https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Запечатлеваю моменты, которые останутся с вами навсегда',
  'Профессиональная фотография в Москве | Свадьбы • Love Story • Портреты • Семейные съемки',
  'bagreshevafoto@gmail.com',
  '+7 (999) 123-45-67',
  'Москва'
)
ON CONFLICT (id) DO UPDATE SET
  photographer_name = EXCLUDED.photographer_name,
  photographer_description = EXCLUDED.photographer_description,
  photographer_photo = EXCLUDED.photographer_photo,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  contact_address = EXCLUDED.contact_address,
  updated_at = now();
