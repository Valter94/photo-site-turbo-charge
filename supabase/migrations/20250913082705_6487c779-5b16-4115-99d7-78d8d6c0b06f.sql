-- Очистка дублированных записей в site_settings
DELETE FROM site_settings WHERE id NOT IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY updated_at DESC) as rn 
    FROM site_settings
  ) t WHERE rn = 1
);

-- Создание уникального индекса для предотвращения дублирования
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_singleton ON site_settings ((1));