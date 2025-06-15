
-- Создаем таблицу для хранения сессий пользователей телеграм-бота
CREATE TABLE public.telegram_sessions (
  user_id BIGINT PRIMARY KEY,
  session_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Добавляем комментарии для ясности
COMMENT ON TABLE public.telegram_sessions IS 'Хранит сессии пользователей для Telegram-бота.';
COMMENT ON COLUMN public.telegram_sessions.user_id IS 'Уникальный идентификатор пользователя в Telegram.';
COMMENT ON COLUMN public.telegram_sessions.session_data IS 'Данные сессии в формате JSON (шаг, введенные данные и т.д.).';
COMMENT ON COLUMN public.telegram_sessions.updated_at IS 'Время последнего обновления сессии.';

-- Создаем индекс для быстрого поиска старых сессий
CREATE INDEX idx_telegram_sessions_updated_at ON public.telegram_sessions(updated_at);
