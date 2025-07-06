import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Ты - продвинутый AI-ассистент для управления сайтом фотографа. У тебя есть полный доступ к базе данных и возможность выполнять любые операции.

ТВОИ ВОЗМОЖНОСТИ:
1. Управление портфолио (добавление, редактирование, удаление фото)
2. Управление ценами и услугами
3. Управление отзывами и одобрение/отклонение
4. Управление локациями для фотосессий
5. Управление бронированиями
6. SEO оптимизация контента
7. Аналитика и отчеты
8. Настройки сайта

КОМАНДЫ КОТОРЫЕ ТЫ МОЖЕШЬ ВЫПОЛНЯТЬ:
- ADD_PORTFOLIO: добавить фото в портфолио
- UPDATE_PORTFOLIO: обновить существующее фото
- DELETE_PORTFOLIO: удалить фото из портфолио
- ADD_PRICING: добавить новый тариф
- UPDATE_PRICING: обновить тариф
- APPROVE_REVIEW: одобрить отзыв
- REJECT_REVIEW: отклонить отзыв
- ADD_LOCATION: добавить новую локацию
- UPDATE_SETTINGS: обновить настройки сайта
- GET_ANALYTICS: получить аналитику
- SEO_OPTIMIZE: оптимизировать SEO

Отвечай кратко и конкретно. Всегда предлагай конкретные действия для улучшения сайта.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, command, data } = await req.json();
    
    console.log('Received request:', { message, command, data });

    // Выполняем команду если она есть
    if (command) {
      const result = await executeCommand(command, data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Анализируем сообщение и определяем нужна ли команда
    const analysis = await analyzeMessage(message);
    
    let response = analysis.response;
    let commandResult = null;

    // Выполняем команду если AI определил, что она нужна
    if (analysis.suggestedCommand) {
      commandResult = await executeCommand(analysis.suggestedCommand, analysis.commandData);
      response += `\n\nВыполнено: ${commandResult.message}`;
    }

    return new Response(JSON.stringify({ 
      response, 
      commandResult,
      suggestions: analysis.suggestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-admin-chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeMessage(message: string) {
  if (!openAIApiKey) {
    return {
      response: "OpenAI API ключ не настроен. Добавьте ключ в настройки.",
      suggestedCommand: null,
      commandData: null,
      suggestions: []
    };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  // Определяем команду на основе сообщения пользователя
  let suggestedCommand = null;
  let commandData = null;
  let suggestions = [];

  if (message.toLowerCase().includes('добави') && message.toLowerCase().includes('фото')) {
    suggestedCommand = 'GET_PORTFOLIO_STATS';
    suggestions.push('Добавить новое фото в портфолио');
  }

  if (message.toLowerCase().includes('отзыв') || message.toLowerCase().includes('review')) {
    suggestedCommand = 'GET_PENDING_REVIEWS';
    suggestions.push('Проверить ожидающие отзывы');
  }

  if (message.toLowerCase().includes('цен') || message.toLowerCase().includes('тариф')) {
    suggestedCommand = 'GET_PRICING_STATS';
    suggestions.push('Обновить прайс-лист');
  }

  if (message.toLowerCase().includes('аналитик') || message.toLowerCase().includes('статистик')) {
    suggestedCommand = 'GET_ANALYTICS';
    suggestions.push('Показать полную аналитику');
  }

  return {
    response: aiResponse,
    suggestedCommand,
    commandData,
    suggestions
  };
}

async function executeCommand(command: string, data: any = {}) {
  console.log('Executing command:', command, data);

  switch (command) {
    case 'GET_PORTFOLIO_STATS':
      const { data: portfolio } = await supabase.from('portfolio').select('*');
      return {
        success: true,
        message: `В портфолио ${portfolio?.length || 0} фотографий`,
        data: portfolio
      };

    case 'GET_PENDING_REVIEWS':
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', false);
      return {
        success: true,
        message: `Ожидает модерации: ${reviews?.length || 0} отзывов`,
        data: reviews
      };

    case 'APPROVE_REVIEW':
      const { error: approveError } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', data.reviewId);
      return {
        success: !approveError,
        message: approveError ? 'Ошибка при одобрении отзыва' : 'Отзыв одобрен'
      };

    case 'GET_PRICING_STATS':
      const { data: pricing } = await supabase.from('pricing').select('*');
      return {
        success: true,
        message: `Активных тарифов: ${pricing?.length || 0}`,
        data: pricing
      };

    case 'GET_ANALYTICS':
      const [portfolioRes, reviewsRes, bookingsRes] = await Promise.all([
        supabase.from('portfolio').select('*'),
        supabase.from('reviews').select('*'),
        supabase.from('bookings').select('*')
      ]);

      const analytics = {
        portfolio: portfolioRes.data?.length || 0,
        reviews: reviewsRes.data?.length || 0,
        pendingReviews: reviewsRes.data?.filter(r => !r.is_approved).length || 0,
        bookings: bookingsRes.data?.length || 0,
        recentBookings: bookingsRes.data?.filter(b => 
          new Date(b.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0
      };

      return {
        success: true,
        message: 'Аналитика получена',
        data: analytics
      };

    case 'ADD_PORTFOLIO':
      const { error: addError } = await supabase
        .from('portfolio')
        .insert([{
          title: data.title,
          category: data.category,
          image_url: data.imageUrl,
          description: data.description,
          location: data.location,
          is_featured: data.featured || false
        }]);
      return {
        success: !addError,
        message: addError ? 'Ошибка при добавлении фото' : 'Фото добавлено в портфолио'
      };

    case 'UPDATE_SETTINGS':
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert([data]);
      return {
        success: !settingsError,
        message: settingsError ? 'Ошибка при обновлении настроек' : 'Настройки обновлены'
      };

    case 'SEO_OPTIMIZE':
      return {
        success: true,
        message: 'SEO рекомендации сгенерированы',
        data: {
          recommendations: [
            'Добавить alt теги ко всем изображениям',
            'Оптимизировать заголовки страниц',
            'Добавить мета-описания',
            'Улучшить внутреннюю перелинковку',
            'Оптимизировать скорость загрузки'
          ]
        }
      };

    default:
      return {
        success: false,
        message: 'Неизвестная команда'
      };
  }
}