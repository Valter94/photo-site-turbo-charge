
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

  return {
    getPortfolioList,
    getDeleteList,
    getPhotoInfo,
    deletePhoto
  }
}
