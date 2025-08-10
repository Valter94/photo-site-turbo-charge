
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createLocationsHandlers = (supabase: SupabaseClient) => {
  const getLocationsList = async () => {
    const { data: locationsData, error } = await supabase
      .from('photoshoot_locations')
      .select(`
        *,
        location_categories(name, description)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    let locationsList = `📍 <b>Управление локациями фотосессий</b>\n\n`;
    
    if (locationsData && locationsData.length > 0) {
      locationsList += `<i>Всего локаций: ${locationsData.length}</i>\n\n`;
      
      locationsData.forEach((location, index) => {
        const category = location.location_categories?.name || 'Без категории';
        const indoor = location.indoor ? '🏠' : '🌳';
        const hasPhoto = location.image_url ? '📸' : '❌';
        
        locationsList += `${index + 1}. <b>${location.name}</b> ${indoor}\n`;
        locationsList += `   📂 <i>${category}</i>\n`;
        locationsList += `   📝 ${location.description?.substring(0, 60)}${location.description && location.description.length > 60 ? '...' : ''}\n`;
        locationsList += `   📍 ${location.address || 'Адрес не указан'}\n`;
        locationsList += `   ⏰ ${location.best_time || 'Время не указано'}\n`;
        locationsList += `   ${hasPhoto} Фото: ${location.image_url ? 'Есть' : 'Отсутствует'}\n\n`;
      });
    } else {
      locationsList += `📭 <i>Локации пока не добавлены</i>\n\n`;
      locationsList += `Используйте кнопку "➕ Добавить локацию" для создания первой локации.\n\n`;
    }

    return {
      text: locationsList,
      keyboard: {
        inline_keyboard: [
          [
            { text: '➕ Добавить локацию', callback_data: 'add_location' },
            { text: '📸 Загрузить фото', callback_data: 'change_location_photo' }
          ],
          [
            { text: '✏️ Редактировать', callback_data: 'edit_location_list' },
            { text: '🗑️ Удалить', callback_data: 'delete_location' }
          ],
          [
            { text: '🔄 Обновить список', callback_data: 'manage_locations' },
            { text: '🔙 Главное меню', callback_data: 'main_menu' }
          ]
        ]
      }
    };
  };

  const getLocationChangePhotoList = async () => {
    const { data: locationsData, error } = await supabase
      .from('photoshoot_locations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    let locationsList = `📸 <b>Выберите локацию для изменения фото:</b>\n\n`
    
    const keyboard: any[][] = []
    
    if (locationsData && locationsData.length > 0) {
      locationsData.forEach((item, index) => {
        locationsList += `${index + 1}. <b>${item.name}</b>\n`
        locationsList += `   ${item.image_url ? '📸 Есть фото' : '❌ Нет фото'}\n\n`
        
        keyboard.push([{ 
          text: `${index + 1}. ${item.name}`, 
          callback_data: `change_photo_${item.id}` 
        }])
      })
    } else {
      locationsList += `Локации не добавлены\n\n`
    }

    keyboard.push([{ text: '🔙 Назад к локациям', callback_data: 'manage_locations' }])

    return {
      text: locationsList,
      keyboard: { inline_keyboard: keyboard }
    }
  }

  const getDeleteLocationList = async () => {
    const { data: locationsData, error } = await supabase
      .from('photoshoot_locations')
      .select('id, name, description')
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!locationsData || locationsData.length === 0) {
      return {
        text: '📭 <b>Локации не найдены</b>\n\nНет локаций для удаления.',
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 Назад', callback_data: 'manage_locations' }]
          ]
        }
      }
    }

    let deleteList = `🗑️ <b>Выберите локацию для удаления:</b>\n\n`
    const keyboard: any[][] = []
    
    locationsData.forEach((item, index) => {
      deleteList += `${index + 1}. <b>${item.name}</b>\n`
      deleteList += `   📝 ${item.description?.substring(0, 30) || 'Без описания'}...\n\n`
      
      keyboard.push([{ 
        text: `${index + 1}. ${item.name}`, 
        callback_data: `delete_location_${item.id}` 
      }])
    })

    keyboard.push([{ text: '❌ Отмена', callback_data: 'manage_locations' }])

    return {
      text: deleteList,
      keyboard: { inline_keyboard: keyboard }
    }
  }

  const deleteLocation = async (locationId: string) => {
    try {
      // Получаем информацию о локации перед удалением
      const { data: locationData, error: fetchError } = await supabase
        .from('photoshoot_locations')
        .select('name, image_url')
        .eq('id', locationId)
        .single()

      if (fetchError) throw fetchError

      // Удаляем локацию из базы данных
      const { error: deleteError } = await supabase
        .from('photoshoot_locations')
        .delete()
        .eq('id', locationId)

      if (deleteError) throw deleteError

      // Пытаемся удалить файл из Storage (если есть)
      if (locationData.image_url) {
        try {
          const urlParts = locationData.image_url.split('/')
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
        text: `✅ <b>Локация удалена!</b>\n\n` +
              `📍 <b>${locationData.name}</b> успешно удалена.`,
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 К управлению локациями', callback_data: 'manage_locations' }]
          ]
        }
      }
    } catch (error) {
      console.error('❌ Ошибка удаления локации:', error)
      throw new Error(`Ошибка удаления: ${error.message}`)
    }
  }

  const getLocationInfo = async (locationId: string) => {
    const { data: locationData, error: fetchError } = await supabase
      .from('photoshoot_locations')
      .select('name, description')
      .eq('id', locationId)
      .single()

    if (fetchError) throw fetchError

    return {
      text: `🗑️ <b>Подтвердите удаление:</b>\n\n` +
            `📍 <b>${locationData.name}</b>\n` +
            `📝 ${locationData.description || 'Без описания'}\n\n` +
            `⚠️ Это действие нельзя отменить!`,
      keyboard: {
        inline_keyboard: [
          [
            { text: '✅ Да, удалить', callback_data: `confirm_delete_location_${locationId}` },
            { text: '❌ Отмена', callback_data: 'delete_location' }
          ]
        ]
      }
    }
  }

  const updateLocationPhoto = async (locationId: string, photoFileId: string, botToken: string, supabase: SupabaseClient) => {
    try {
      // Получаем файл из Telegram
      const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${photoFileId}`)
      const fileData = await fileResponse.json()
      
      if (!fileData.ok) {
        throw new Error('Не удалось получить файл из Telegram')
      }

      // Скачиваем файл
      const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
      const imageResponse = await fetch(fileUrl)
      const imageBlob = await imageResponse.blob()
      
      // Генерируем имя файла
      const fileName = `location-${locationId}-${Date.now()}.jpg`
      const storagePath = `locations/${fileName}`
      
      // Загружаем в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(storagePath, imageBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600'
        })

      if (uploadError) {
        throw uploadError
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(storagePath)

      const imageUrl = urlData.publicUrl

      // Обновляем локацию в базе данных
      const { error: updateError } = await supabase
        .from('photoshoot_locations')
        .update({ image_url: imageUrl })
        .eq('id', locationId)

      if (updateError) {
        throw updateError
      }

      return {
        text: `✅ <b>Фото локации обновлено!</b>\n\n` +
              `📸 Новое фото успешно загружено и установлено для локации.`,
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 К управлению локациями', callback_data: 'manage_locations' }]
          ]
        }
      }
    } catch (error) {
      console.error('❌ Ошибка обновления фото локации:', error)
      throw new Error(`Ошибка обновления фото: ${error.message}`)
    }
  }

  const addLocation = async (sessionData: any) => {
    const { data, error } = await supabase
      .from('photoshoot_locations')
      .insert({
        name: sessionData.title,
        description: sessionData.description || 'Добавлено через Telegram бот',
        image_url: sessionData.image_url || null,
        address: sessionData.address || null,
        best_time: sessionData.best_time || null,
        indoor: !!sessionData.indoor || false,
        category_id: null
      })
      .select()
      .single()

    if (error) throw error

    return {
      text: `✅ <b>Локация добавлена!</b>\n\n📍 ${data.name}\n📝 ${data.description}`,
      keyboard: {
        inline_keyboard: [
          [{ text: '📍 К локациям', callback_data: 'manage_locations' }],
          [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  return { 
    getLocationsList,
    getLocationChangePhotoList,
    getDeleteLocationList,
    deleteLocation,
    getLocationInfo,
    updateLocationPhoto,
    addLocation
  }
}
