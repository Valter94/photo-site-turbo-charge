
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createPortfolioHandlers = (supabase: SupabaseClient) => {
  const getPortfolioList = async () => {
    const { data: portfolioData, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    let portfolioList = `🎨 <b>Управление портфолио</b>\n\n`
    if (portfolioData && portfolioData.length > 0) {
      portfolioData.forEach((item, index) => {
        portfolioList += `${index + 1}. <b>${item.title}</b>\n`
        portfolioList += `   📂 ${item.category}\n`
        portfolioList += `   📅 ${new Date(item.created_at).toLocaleDateString('ru-RU')}\n\n`
      })
    } else {
      portfolioList += `Фотографии не добавлены\n\n`
    }

    return {
      text: portfolioList,
      keyboard: {
        inline_keyboard: [
          [
            { text: '🗑️ Удалить фото', callback_data: 'delete_portfolio' },
            { text: '➕ Добавить фото', callback_data: 'add_portfolio' }
          ],
          [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  const getDeleteList = async () => {
    const { data: portfolioData, error } = await supabase
      .from('portfolio')
      .select('id, title, category, created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    if (!portfolioData || portfolioData.length === 0) {
      return {
        text: '📭 <b>Портфолио пусто</b>\n\nНет фотографий для удаления.',
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 Назад', callback_data: 'manage_portfolio' }]
          ]
        }
      }
    }

    let deleteList = `🗑️ <b>Выберите фото для удаления:</b>\n\n`
    const keyboard: any[][] = []
    
    portfolioData.forEach((item, index) => {
      deleteList += `${index + 1}. <b>${item.title}</b> (${item.category})\n`
      keyboard.push([{ 
        text: `${index + 1}. ${item.title}`, 
        callback_data: `delete_photo_${item.id}` 
      }])
    })

    keyboard.push([{ text: '❌ Отмена', callback_data: 'manage_portfolio' }])

    return {
      text: deleteList,
      keyboard: { inline_keyboard: keyboard }
    }
  }

  const deletePhoto = async (photoId: string) => {
    const { data: photoData, error: fetchError } = await supabase
      .from('portfolio')
      .select('title, image_url')
      .eq('id', photoId)
      .single()

    if (fetchError) throw fetchError

    // Удаляем запись из базы данных
    const { error: deleteError } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', photoId)

    if (deleteError) throw deleteError

    // Удаляем файл из Storage (опционально)
    if (photoData.image_url) {
      try {
        const urlParts = photoData.image_url.split('/')
        const bucketIndex = urlParts.findIndex(part => part === 'images')
        
        if (bucketIndex !== -1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/')
          
          const { error: storageError } = await supabase.storage
            .from('images')
            .remove([filePath])

          if (storageError) {
            console.warn('⚠️ Ошибка удаления файла из Storage:', storageError)
          }
        }
      } catch (storageError) {
        console.warn('⚠️ Ошибка при удалении файла:', storageError)
      }
    }

    return {
      text: `✅ <b>Фотография удалена!</b>\n\n` +
            `📷 <b>${photoData.title}</b> успешно удалена из портфолио.`,
      keyboard: {
        inline_keyboard: [
          [{ text: '🔙 К управлению портфолио', callback_data: 'manage_portfolio' }]
        ]
      }
    }
  }

  const getPhotoInfo = async (photoId: string) => {
    const { data: photoData, error: fetchError } = await supabase
      .from('portfolio')
      .select('title, image_url')
      .eq('id', photoId)
      .single()

    if (fetchError) throw fetchError

    return {
      text: `🗑️ <b>Подтвердите удаление:</b>\n\n` +
            `📷 <b>${photoData.title}</b>\n\n` +
            `⚠️ Это действие нельзя отменить!`,
      keyboard: {
        inline_keyboard: [
          [
            { text: '✅ Да, удалить', callback_data: `confirm_delete_${photoId}` },
            { text: '❌ Отмена', callback_data: 'delete_portfolio' }
          ]
        ]
      }
    }
  }

  return { getPortfolioList, getDeleteList, deletePhoto, getPhotoInfo }
}
