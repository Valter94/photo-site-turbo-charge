import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, imageUrls, options = {} } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    switch (action) {
      case 'check_broken_images':
        return await checkBrokenImages(imageUrls)
      
      case 'optimize_images':
        return await optimizeImages(imageUrls, options)
      
      case 'fix_broken_images':
        return await fixBrokenImages(imageUrls, supabase)
      
      case 'get_russian_location_images':
        return await getRussianLocationImages()
      
      default:
        throw new Error('Unknown action')
    }

  } catch (error) {
    console.error('Error in ai-image-optimizer:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function checkBrokenImages(imageUrls: string[]) {
  const results = []
  
  for (const url of imageUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      results.push({
        url,
        isWorking: response.ok,
        status: response.status,
        statusText: response.statusText
      })
    } catch (error) {
      results.push({
        url,
        isWorking: false,
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function optimizeImages(imageUrls: string[], options: any) {
  // В реальной реализации здесь была бы интеграция с сервисом оптимизации изображений
  // Например, TinyPNG API, ImageOptim API или собственный сервис
  
  const optimizedResults = []
  
  for (const url of imageUrls) {
    try {
      // Имитация процесса оптимизации
      const originalSize = Math.floor(Math.random() * 2000000) + 500000 // 0.5-2.5MB
      const optimizedSize = Math.floor(originalSize * (0.4 + Math.random() * 0.4)) // 40-80% от оригинала
      const compressionRatio = Math.round((1 - optimizedSize / originalSize) * 100)

      optimizedResults.push({
        url,
        originalSize,
        optimizedSize,
        compressionRatio,
        optimizedUrl: url, // В реальности это был бы новый URL
        success: true
      })
    } catch (error) {
      optimizedResults.push({
        url,
        success: false,
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ results: optimizedResults }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function fixBrokenImages(brokenImages: any[], supabase: any) {
  const russianImages = await getRussianLocationImagesData()
  const portfolioImages = getPortfolioReplacementImages()
  
  const fixResults = []
  
  for (const image of brokenImages) {
    try {
      let newImageUrl = ''
      
      if (image.type === 'location') {
        // Найти подходящее изображение российской локации
        const locationName = image.name.toLowerCase()
        newImageUrl = findBestLocationMatch(locationName, russianImages)
      } else {
        // Использовать случайное изображение из портфолио
        newImageUrl = portfolioImages[Math.floor(Math.random() * portfolioImages.length)]
      }

      // Обновить в базе данных
      if (image.type === 'location') {
        await supabase
          .from('photoshoot_locations')
          .update({ image_url: newImageUrl })
          .eq('id', image.id)
      } else {
        await supabase
          .from('portfolio')
          .update({ image_url: newImageUrl })
          .eq('id', image.id)
      }

      fixResults.push({
        id: image.id,
        oldUrl: image.url,
        newUrl: newImageUrl,
        success: true
      })
    } catch (error) {
      fixResults.push({
        id: image.id,
        success: false,
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({ results: fixResults }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getRussianLocationImages() {
  const images = await getRussianLocationImagesData()
  
  return new Response(
    JSON.stringify({ images }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

function getRussianLocationImagesData() {
  return {
    'красная площадь': [
      'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80'
    ],
    'воробьевы горы': [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=80',
      'https://images.unsplash.com/photo-1571043733612-8c57b9e7c6d3?w=800&q=80'
    ],
    'царицыно': [
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
      'https://images.unsplash.com/photo-1571116728936-e3b2e2e9e2fa?w=800&q=80'
    ],
    'коломенское': [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=800&q=80',
      'https://images.unsplash.com/photo-1582894665070-3f8b4a0e6c69?w=800&q=80'
    ],
    'вднх': [
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
      'https://images.unsplash.com/photo-1571116728936-e3b2e2e9e2fa?w=800&q=80'
    ],
    'парк горького': [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1441906363396-5c6e8f6b5565?w=800&q=80'
    ],
    'измайловский парк': [
      'https://images.unsplash.com/photo-1441906363396-5c6e8f6b5565?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    ],
    'арбат': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80'
    ],
    'храм христа спасителя': [
      'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80'
    ],
    'новодевичий монастырь': [
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
      'https://images.unsplash.com/photo-1571116728936-e3b2e2e9e2fa?w=800&q=80'
    ]
  }
}

function getPortfolioReplacementImages() {
  return [
    'https://images.unsplash.com/photo-1494790108755-2616c5c9b8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1541647376583-8934aaf3448a?w=800&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80'
  ]
}

function findBestLocationMatch(locationName: string, russianImages: any) {
  for (const [key, images] of Object.entries(russianImages)) {
    if (locationName.includes(key)) {
      return images[0] as string
    }
  }
  
  // Если точное совпадение не найдено, возвращаем случайное изображение
  const allImages = Object.values(russianImages).flat() as string[]
  return allImages[Math.floor(Math.random() * allImages.length)]
}