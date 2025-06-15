
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createPricingHandlers = (supabase: SupabaseClient) => {
  const getPricingList = async () => {
    const { data: pricingData, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error

    let pricingList = `💰 <b>Управление ценами</b>\n\n`
    if (pricingData && pricingData.length > 0) {
      pricingData.forEach((item, index) => {
        const serviceNames: { [key: string]: string } = {
          'wedding': 'Свадебная съемка',
          'portrait': 'Портретная съемка',
          'family': 'Семейная съемка',
          'corporate': 'Корпоративная съемка',
          'lovestory': 'Love Story'
        }
        
        pricingList += `${index + 1}. <b>${serviceNames[item.service_type] || item.service_type}</b>\n`
        pricingList += `   💵 ${item.price} руб. (${item.duration_hours}ч)\n`
        pricingList += `   📸 ${item.photos_count} фото\n`
        pricingList += `   📍 ${item.locations_count} локации\n\n`
      })
    } else {
      pricingList += `Цены не установлены\n\n`
    }

    return {
      text: pricingList,
      keyboard: {
        inline_keyboard: [
          [
            { text: '✏️ Изменить цены', callback_data: 'edit_pricing' },
            { text: '➕ Добавить тариф', callback_data: 'add_pricing' }
          ],
          [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  const getEditPricingList = async () => {
    const { data: pricingData, error } = await supabase
      .from('pricing')
      .select('id, service_type, price, duration_hours')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error

    if (!pricingData || pricingData.length === 0) {
      return {
        text: '📭 <b>Тарифы не найдены</b>\n\nСначала добавьте тарифы.',
        keyboard: {
          inline_keyboard: [
            [{ text: '🔙 Назад', callback_data: 'manage_pricing' }]
          ]
        }
      }
    }

    let editList = `✏️ <b>Выберите тариф для изменения:</b>\n\n`
    const keyboard: any[][] = []
    
    const serviceNames: { [key: string]: string } = {
      'wedding': 'Свадебная съемка',
      'portrait': 'Портретная съемка', 
      'family': 'Семейная съемка',
      'corporate': 'Корпоративная съемка',
      'lovestory': 'Love Story'
    }

    pricingData.forEach((item, index) => {
      const serviceName = serviceNames[item.service_type] || item.service_type
      editList += `${index + 1}. <b>${serviceName}</b> - ${item.price} руб.\n`
      keyboard.push([{ 
        text: `${index + 1}. ${serviceName}`, 
        callback_data: `edit_price_${item.id}` 
      }])
    })

    keyboard.push([{ text: '❌ Отмена', callback_data: 'manage_pricing' }])

    return {
      text: editList,
      keyboard: { inline_keyboard: keyboard }
    }
  }

  return { getPricingList, getEditPricingList }
}
