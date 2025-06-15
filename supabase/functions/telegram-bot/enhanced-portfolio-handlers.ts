
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createLogger } from './logger.ts'

const logger = createLogger('EnhancedPortfolioHandlers')

export const createEnhancedPortfolioHandlers = (supabase: SupabaseClient) => {
  const getPortfolioList = async () => {
    try {
      const { data: portfolioData, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      let portfolioList = `🎨 <b>Управление портфолио</b>\n\n`
      if (portfolioData && portfolioData.length > 0) {
        portfolioData.forEach((item, index) => {
          portfolioList += `${index + 1}. <b>${item.title}</b>\n`
          portfolioList += `   🏷 ${item.category}\n`
          portfolioList += `   📝 ${item.description?.substring(0, 50)}...\n\n`
        })
        portfolioList += `📊 Всего фото: <b>${portfolioData.length}</b>\n\n`
      } else {
        portfolioList += `Портфолио пусто\n\n`
      }

      return {
        text: portfolioList,
        keyboard: {
          inline_keyboard: [
            [
              { text: '📸 Добавить фото', callback_data: 'add_portfolio' },
              { text: '🗑 Удалить фото', callback_data: 'delete_portfolio' }
            ],
            [{ text: '🔙 Назад', callback_data: 'main_menu' }]
          ]
        }
      }
    } catch (error) {
      logger.error('Error getting portfolio list', error)
      throw error
    }
  }

  const getDeleteList = async () => {
    try {
      const { data: portfolioData, error } = await supabase
        .from('portfolio')
        .select('id, title, category')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!portfolioData || portfolioData.length === 0) {
        return {
          text: '🗑 <b>Удаление фото</b>\n\nПортфолио пусто. Нечего удалять.',
          keyboard: {
            inline_keyboard: [
              [{ text: '🔙 Назад', callback_data: 'manage_portfolio' }]
            ]
          }
        }
      }

      const keyboard = []
      for (const item of portfolioData) {
        keyboard.push([{
          text: `${item.title} (${item.category})`,
          callback_data: `delete_photo_${item.id}`
        }])
      }
      keyboard.push([{ text: '🔙 Назад', callback_data: 'manage_portfolio' }])

      return {
        text: '🗑 <b>Выберите фото для удаления:</b>',
        keyboard: { inline_keyboard: keyboard }
      }
    } catch (error) {
      logger.error('Error getting delete list', error)
      throw error
    }
  }

  const getPhotoInfo = async (photoId: string) => {
    try {
      const { data: photo, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', photoId)
        .single()

      if (error) throw error

      if (!photo) {
        return {
          text: '❌ <b>Фото не найдено</b>',
          keyboard: {
            inline_keyboard: [
              [{ text: '🔙 Назад', callback_data: 'delete_portfolio' }]
            ]
          }
        }
      }

      return {
        text: `🗑 <b>Подтвердите удаление:</b>\n\n` +
              `📷 Название: ${photo.title}\n` +
              `🏷 Категория: ${photo.category}\n` +
              `📝 Описание: ${photo.description}\n\n` +
              `⚠️ <b>Это действие нельзя отменить!</b>`,
        keyboard: {
          inline_keyboard: [
            [
              { text: '✅ Да, удалить', callback_data: `confirm_delete_${photoId}` },
              { text: '❌ Отмена', callback_data: 'delete_portfolio' }
            ]
          ]
        }
      }
    } catch (error) {
      logger.error('Error getting photo info', error)
      throw error
    }
  }

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', photoId)

      if (error) throw error

      return {
        text: '✅ <b>Фото успешно удалено!</b>',
        keyboard: {
          inline_keyboard: [
            [
              { text: '🗑 Удалить еще', callback_data: 'delete_portfolio' },
              { text: '🔙 К портфолио', callback_data: 'manage_portfolio' }
            ]
          ]
        }
      }
    } catch (error) {
      logger.error('Error deleting photo', error)
      throw error
    }
  }

  const processPhotoUpload = async (userId: number, fileId: string, sessionData: any) => {
    try {
      logger.log('Processing photo upload', { userId, fileId, sessionData })

      // Получаем информацию о файле
      const response = await fetch(`https://api.telegram.org/bot${Deno.env.get('TELEGRAM_BOT_TOKEN')}/getFile?file_id=${fileId}`)
      const fileInfo = await response.json()

      if (!fileInfo.ok) {
        throw new Error('Failed to get file info')
      }

      // Загружаем файл
      const fileUrl = `https://api.telegram.org/file/bot${Deno.env.get('TELEGRAM_BOT_TOKEN')}/${fileInfo.result.file_path}`
      const fileResponse = await fetch(fileUrl)

      if (!fileResponse.ok) {
        throw new Error('Failed to download file')
      }

      const fileBlob = await fileResponse.blob()
      const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

      // Загружаем в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`portfolio/${fileName}`, fileBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600'
        })

      if (uploadError) {
        logger.error('Upload error', uploadError)
        throw uploadError
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`portfolio/${fileName}`)

      const imageUrl = urlData.publicUrl

      // Сохраняем в базу данных
      const { data: portfolioData, error: dbError } = await supabase
        .from('portfolio')
        .insert({
          title: sessionData.title || 'Новое фото',
          category: sessionData.category || 'portrait',
          description: sessionData.description || 'Описание добавлено через Telegram бот',
          image_url: imageUrl,
          location: sessionData.location || null,
          client_name: sessionData.client_name || null
        })
        .select()
        .single()

      if (dbError) {
        logger.error('Database error', dbError)
        throw dbError
      }

      logger.log('Photo successfully uploaded', { portfolioData })

      return {
        text: `✅ <b>Фото успешно добавлено!</b>\n\n` +
              `📷 Название: ${portfolioData.title}\n` +
              `🏷 Категория: ${portfolioData.category}\n` +
              `📝 Описание: ${portfolioData.description}`,
        keyboard: {
          inline_keyboard: [
            [
              { text: '📸 Добавить еще', callback_data: 'add_portfolio' },
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        }
      }
    } catch (error) {
      logger.error('Error processing photo upload', error)
      throw error
    }
  }

  return {
    getPortfolioList,
    getDeleteList,
    getPhotoInfo,
    deletePhoto,
    processPhotoUpload
  }
}
