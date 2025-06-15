
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createPhotoProcessingHandlers = (supabase: SupabaseClient) => {
  const getProcessingMenu = () => {
    return {
      text: `🎨 <b>Обработка фотографий</b>\n\n` +
            `Выберите тип обработки:`,
      keyboard: {
        inline_keyboard: [
          [
            { text: '✨ Автокоррекция', callback_data: 'filter_auto' },
            { text: '🎭 Портретная ретушь', callback_data: 'filter_portrait' }
          ],
          [
            { text: '🌅 Пейзажный фильтр', callback_data: 'filter_landscape' },
            { text: '🎨 Художественный', callback_data: 'filter_artistic' }
          ],
          [
            { text: '📷 Винтажный стиль', callback_data: 'filter_vintage' },
            { text: '🌟 Яркие цвета', callback_data: 'filter_vibrant' }
          ],
          [
            { text: '🎯 По эталону', callback_data: 'filter_reference' },
            { text: '📁 Пакетная обработка', callback_data: 'batch_process' }
          ],
          [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  const getFilterDescription = (filterType: string) => {
    const descriptions: { [key: string]: string } = {
      'auto': '✨ <b>Автокоррекция</b>\n• Баланс белого\n• Яркость и контраст\n• Резкость\n• Шумоподавление',
      'portrait': '🎭 <b>Портретная ретушь</b>\n• Сглаживание кожи\n• Осветление глаз\n• Коррекция тона\n• Удаление дефектов',
      'landscape': '🌅 <b>Пейзажный фильтр</b>\n• Насыщенность неба\n• Детализация переднего плана\n• Контраст облаков\n• Цветокоррекция',
      'artistic': '🎨 <b>Художественная обработка</b>\n• Креативные тона\n• Мягкие переходы\n• Атмосферные эффекты\n• Стилизация',
      'vintage': '📷 <b>Винтажный стиль</b>\n• Пленочные тона\n• Легкие царапины\n• Теплые цвета\n• Ретро атмосфера',
      'vibrant': '🌟 <b>Яркие цвета</b>\n• Повышенная насыщенность\n• Живые тона\n• Контрастность\n• Энергичность',
      'reference': '🎯 <b>Обработка по эталону</b>\n• Анализ стиля эталона\n• Применение тонов\n• Копирование настроения\n• Цветовая схема'
    }

    return descriptions[filterType] || 'Обработка фотографии'
  }

  const startPhotoProcessing = (filterType: string) => {
    return {
      text: `${getFilterDescription(filterType)}\n\n` +
            `📸 <b>Отправьте фотографии для обработки</b>\n` +
            `(до 10 фото одновременно)\n\n` +
            `${filterType === 'reference' ? '📎 Сначала отправьте эталонное фото, затем фото для обработки' : ''}`,
      keyboard: {
        inline_keyboard: [
          [{ text: '❌ Отмена', callback_data: 'cancel' }]
        ]
      }
    }
  }

  const applySimpleFilter = async (imageBlob: Blob, filterType: string): Promise<Blob> => {
    // Создаем canvas для обработки изображения
    const canvas = new OffscreenCanvas(800, 600)
    const ctx = canvas.getContext('2d')!
    
    // Создаем ImageBitmap из blob
    const imageBitmap = await createImageBitmap(imageBlob)
    
    // Устанавливаем размер canvas по размеру изображения
    canvas.width = imageBitmap.width
    canvas.height = imageBitmap.height
    
    // Применяем фильтры в зависимости от типа
    switch (filterType) {
      case 'auto':
        ctx.filter = 'brightness(110%) contrast(105%) saturate(105%)'
        break
      case 'portrait':
        ctx.filter = 'brightness(108%) contrast(102%) saturate(110%) blur(0.3px)'
        break
      case 'landscape':
        ctx.filter = 'contrast(115%) saturate(125%) brightness(105%)'
        break
      case 'artistic':
        ctx.filter = 'contrast(120%) saturate(90%) brightness(110%) sepia(10%)'
        break
      case 'vintage':
        ctx.filter = 'sepia(35%) brightness(110%) contrast(95%) saturate(120%)'
        break
      case 'vibrant':
        ctx.filter = 'saturate(140%) contrast(110%) brightness(105%)'
        break
      default:
        ctx.filter = 'brightness(105%) contrast(105%)'
    }
    
    // Рисуем изображение с фильтром
    ctx.drawImage(imageBitmap, 0, 0)
    
    // Конвертируем canvas в blob
    return await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 })
  }

  const processPhotos = async (photos: any[], filterType: string, botToken: string) => {
    console.log(`🎨 Начинаю обработку ${photos.length} фото с фильтром ${filterType}`)
    
    const processedPhotos: string[] = []
    
    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        console.log(`📸 Обрабатываю фото ${i + 1}/${photos.length}: ${photo.file_id}`)
        
        // Получаем файл из Telegram
        const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${photo.file_id}`)
        const fileData = await fileResponse.json()
        
        if (!fileData.ok) {
          console.error('❌ Ошибка получения файла:', fileData)
          continue
        }
        
        // Скачиваем файл
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
        const imageResponse = await fetch(fileUrl)
        const imageBlob = await imageResponse.blob()
        
        console.log(`📥 Файл скачан, размер: ${imageBlob.size} байт`)
        
        // Применяем фильтр
        const processedBlob = await applySimpleFilter(imageBlob, filterType)
        
        console.log(`✨ Фильтр применен, новый размер: ${processedBlob.size} байт`)
        
        // Загружаем обработанное фото в Supabase Storage
        const fileName = `processed-${Date.now()}-${i}.jpg`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`processed/${fileName}`, processedBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600'
          })
        
        if (uploadError) {
          console.error('❌ Ошибка загрузки в storage:', uploadError)
          continue
        }
        
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`processed/${fileName}`)
        
        processedPhotos.push(urlData.publicUrl)
        console.log(`✅ Фото ${i + 1} обработано и загружено: ${urlData.publicUrl}`)
      }
      
      return {
        text: `✅ <b>Обработка завершена!</b>\n\n` +
              `📊 Обработано фото: ${processedPhotos.length}/${photos.length}\n` +
              `🎨 Фильтр: ${getFilterDescription(filterType).split('\n')[0]}\n\n` +
              `Обработанные фото:`,
        keyboard: {
          inline_keyboard: [
            [
              { text: '📸 Добавить в портфолио', callback_data: 'add_processed_to_portfolio' },
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        },
        processedPhotos
      }
      
    } catch (error) {
      console.error('❌ Ошибка при обработке фото:', error)
      return {
        text: `❌ <b>Ошибка при обработке фотографий</b>\n\n` +
              `Подробности: ${error.message}`,
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
          ]
        },
        processedPhotos: []
      }
    }
  }

  return {
    getProcessingMenu,
    getFilterDescription,
    startPhotoProcessing,
    processPhotos
  }
}
