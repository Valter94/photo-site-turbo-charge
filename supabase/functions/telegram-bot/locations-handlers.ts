
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createLocationsHandlers = (supabase: SupabaseClient) => {
  const getLocationsList = async () => {
    const { data: locationsData, error } = await supabase
      .from('photoshoot_locations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    let locationsList = `📍 <b>Управление локациями</b>\n\n`
    if (locationsData && locationsData.length > 0) {
      locationsData.forEach((item, index) => {
        locationsList += `${index + 1}. <b>${item.name}</b>\n`
        locationsList += `   📝 ${item.description?.substring(0, 50) || 'Без описания'}${item.description && item.description.length > 50 ? '...' : ''}\n`
        locationsList += `   🏠 ${item.indoor ? 'Помещение' : 'Улица'}\n`
        locationsList += `   📸 ${item.image_url ? 'Есть фото' : 'Нет фото'}\n\n`
      })
    } else {
      locationsList += `Локации не добавлены\n\n`
    }

    return {
      text: locationsList,
      keyboard: {
        inline_keyboard: [
          [
            { text: '🗑️ Удалить локацию', callback_data: 'delete_location' },
            { text: '➕ Добавить локацию', callback_data: 'add_location' }
          ],
          [
            { text: '📸 Изменить фото локации', callback_data: 'change_location_photo' }
          ],
          [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
      }
    }
  }

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
          callback_data: `select_location_for_photo_${item.id}` 
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

  return { 
    getLocationsList,
    getLocationChangePhotoList
  }
}
