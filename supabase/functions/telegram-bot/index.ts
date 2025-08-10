import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { TelegramUpdate, UserSession } from './types.ts'
import { createTelegramAPI } from './telegram-api.ts'
import { createMenuHandlers } from './menu-handlers.ts'
import { createEnhancedPortfolioHandlers } from './enhanced-portfolio-handlers.ts'
import { createEnhancedManagementHandlers } from './enhanced-management-handlers.ts'
import { createLocationsHandlers } from './locations-handlers.ts'
import { 
  getSession as dbGetSession, 
  setSession as dbSetSession, 
  deleteSession as dbDeleteSession, 
  cleanOldSessions 
} from './db-session-manager.ts'
import { createLogger } from './logger.ts'
import { createBotMonitor } from './bot-monitor.ts'
import { createCacheManager } from './cache-manager.ts'
import { validators } from './validators.ts'
import { createCallbackHandlers } from './callback-handlers.ts'
import { createMessageHandlers } from './message-handlers.ts'
import { createScreenshotService } from './screenshot-service.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logger = createLogger('TelegramBot')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let chatId: number | undefined;
  let userId: number | undefined;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

    if (!supabaseUrl || !supabaseServiceKey || !botToken) {
      logger.error('Missing environment variables')
      return new Response('Configuration error', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    await cleanOldSessions(supabase);

    const botMonitor = createBotMonitor(supabase)
    const cache = createCacheManager()
    
    // Ensure storage bucket exists
    const ensureStorageBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets()
        const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
        
        if (!imagesBucket) {
          const { error } = await supabase.storage.createBucket('images', { public: true })
          if (error) logger.warn('Failed to create storage bucket', error)
          else logger.info('Created images storage bucket')
        }
      } catch (error) {
        logger.warn('Storage bucket check failed', error)
      }
    }
    
    await ensureStorageBucket()
    
    const telegramAPI = createTelegramAPI(botToken)
    const menuHandlers = createMenuHandlers(supabase)
    const portfolioHandlers = createEnhancedPortfolioHandlers(supabase)
    const managementHandlers = createEnhancedManagementHandlers(supabase)
    const locationsHandlers = createLocationsHandlers(supabase)
    const screenshotService = createScreenshotService()
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000'

    let update: TelegramUpdate
    try {
      update = await req.json()
    } catch (error) {
      logger.error('JSON parsing error', error)
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders })
    }

    logger.info('Update received', update)

    const message = update.message
    const callbackQuery = update.callback_query

    let messageId: number | undefined

    if (message) {
      chatId = message.chat.id
      userId = message.from.id
    } else if (callbackQuery) {
      chatId = callbackQuery.message.chat.id
      userId = callbackQuery.from.id
      messageId = callbackQuery.message.message_id
    } else {
      return new Response('OK', { headers: corsHeaders })
    }

    // --- Новая логика управления сессиями ---
    let session: UserSession | undefined = userId ? await dbGetSession(supabase, userId) : undefined;
    let sessionModified = false;
    let sessionDeleted = false;
    
    const getSessionSync = (_userId: number) => session;
    const setSessionSync = (_userId: number, newSession: UserSession) => {
      session = newSession;
      sessionModified = true;
      sessionDeleted = false; // Если сессию обновили, она не удалена
    };
    const deleteSessionSync = (_userId: number) => {
      session = undefined;
      sessionDeleted = true;
      sessionModified = false;
    };
    // --- Конец новой логики ---

    // Создаём единый объект зависимостей для всех обработчиков
    const allDeps = {
      telegramAPI,
      supabase,
      menuHandlers,
      portfolioHandlers,
      managementHandlers,
      locationsHandlers,
      botMonitor,
      validators,
      botToken,
      screenshotService,
      siteUrl,
      getSession: getSessionSync,
      setSession: setSessionSync,
      deleteSession: deleteSessionSync,
    };

    const callbackHandler = createCallbackHandlers(allDeps)
    const messageHandler = createMessageHandlers(allDeps)

    // Делегируем хэндлерам
    if (callbackQuery) {
      await callbackHandler({ callbackQuery, chatId, userId, messageId })
    } else if (message) {
      await messageHandler({ message, chatId, userId })
    }
    
    // Сохраняем изменения сессии в БД в конце запроса
    if (userId) {
      if (sessionDeleted) {
        await dbDeleteSession(supabase, userId);
      } else if (sessionModified && session) {
        await dbSetSession(supabase, userId, session);
      }
    }

    return new Response('OK', { headers: corsHeaders })
  } catch (error) {
    logger.error('Critical error', error)
    if (chatId) {
        try {
            const telegramAPI = createTelegramAPI(Deno.env.get('TELEGRAM_BOT_TOKEN')!)
            await telegramAPI.sendMessage(chatId, '❌ Произошла критическая ошибка. Мы уже работаем над этим.');
        } catch(e) {
            logger.error('Failed to send critical error message', e)
        }
    }
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: corsHeaders
    })
  }
})
