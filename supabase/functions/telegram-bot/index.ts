
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { TelegramUpdate } from './types.ts'
import { createTelegramAPI } from './telegram-api.ts'
import { createMenuHandlers } from './menu-handlers.ts'
import { createEnhancedPortfolioHandlers } from './enhanced-portfolio-handlers.ts'
import { createLocationsHandlers } from './locations-handlers.ts'
import { getSession, setSession, deleteSession, cleanOldSessions } from './enhanced-session-manager.ts'
import { createLogger } from './logger.ts'
import { createBotMonitor } from './bot-monitor.ts'
import { createCacheManager } from './cache-manager.ts'
import { validators } from './validators.ts'
import { createCallbackHandlers } from './callback-handlers.ts'
import { createMessageHandlers } from './message-handlers.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logger = createLogger('TelegramBot')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    cleanOldSessions();
    
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
    const locationsHandlers = createLocationsHandlers(supabase)

    // Создаём единый объект зависимостей для всех обработчиков
    const allDeps = {
      telegramAPI,
      supabase,
      menuHandlers,
      portfolioHandlers,
      locationsHandlers,
      botMonitor,
      validators,
      botToken,
      getSession,
      setSession,
      deleteSession
    };

    const callbackHandler = createCallbackHandlers(allDeps)
    const messageHandler = createMessageHandlers(allDeps)

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

    let chatId: number
    let userId: number
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

    // Делегируем хэндлерам новое поведение:
    if (callbackQuery) {
      await callbackHandler({ callbackQuery, chatId, userId, messageId })
      return new Response('OK', { headers: corsHeaders })
    }

    if (message) {
      await messageHandler({ message, chatId, userId })
      return new Response('OK', { headers: corsHeaders })
    }

    return new Response('OK', { headers: corsHeaders })
  } catch (error) {
    logger.error('Critical error', error)
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: corsHeaders
    })
  }
})
