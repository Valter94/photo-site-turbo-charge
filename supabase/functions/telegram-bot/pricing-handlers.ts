
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createPricingHandlers = (supabase: SupabaseClient) => {
  const getPricingList = async () => {
    const { data: pricingData, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error

    const serviceNames: { [key: string]: string } = {
      'wedding': '💒 Свадебная съемка',
      'portrait': '👤 Портретная съемка',
      'family': '👨‍👩‍👧‍👦 Семейная съемка',
      'corporate': '🏢 Корпоративная съемка',
      'lovestory': '💕 Love Story'
    }

    let pricingList = `💰 <b>Управление ценами</b>\n\n`
    if (pricingData && pricingData.length > 0) {
      pricingData.forEach((item, index) => {
        const serviceName = serviceNames[item.service_type] || item.service_type
        pricingList += `${index + 1}. <b>${serviceName}</b>\n`
        pricingList += `   💵 ${item.price.toLocaleString('ru-RU')} руб.\n`
        pricingList += `   ⏱ Продолжительность: ${item.duration_hours} часа\n`
        pricingList += `   📸 Количество фото: ${item.photos_count}\n`
        pricingList += `   📍 Локации: ${item.locations_count}\n\n`
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
        text: '📭 <b>Тарифы не найдены</b>\n\nСначала добавьте тарифы через админ-панель сайта.',
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
      'wedding': '💒 Свадебная съемка',
      'portrait': '👤 Портретная съемка', 
      'family': '👨‍👩‍👧‍👦 Семейная съемка',
      'corporate': '🏢 Корпоративная съемка',
      'lovestory': '💕 Love Story'
    }

    pricingData.forEach((item, index) => {
      const serviceName = serviceNames[item.service_type] || item.service_type
      editList += `${index + 1}. <b>${serviceName}</b>\n`
      editList += `   💰 ${item.price.toLocaleString('ru-RU')} руб. (${item.duration_hours}ч)\n\n`
      
      keyboard.push([{ 
        text: `${index + 1}. ${serviceName.replace(/[^\w\s]/gi, '')}`, 
        callback_data: `edit_price_${item.id}` 
      }])
    })

    keyboard.push([{ text: '❌ Отмена', callback_data: 'manage_pricing' }])

    return {
      text: editList,
      keyboard: { inline_keyboard: keyboard }
    }
  }

  const handlePriceEdit = async (priceId: string) => {
    const { data: priceData, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('id', priceId)
      .single()

    if (error) throw error

    const serviceNames: { [key: string]: string } = {
      'wedding': '💒 Свадебная съемка',
      'portrait': '👤 Портретная съемка', 
      'family': '👨‍👩‍👧‍👦 Семейная съемка',
      'corporate': '🏢 Корпоративная съемка',
      'lovestory': '💕 Love Story'
    }

    const serviceName = serviceNames[priceData.service_type] || priceData.service_type
    
    return {
      text: `✏️ <b>Редактирование тарифа</b>\n\n` +
            `📋 <b>${serviceName}</b>\n\n` +
            `💰 <b>Текущая цена:</b> ${priceData.price.toLocaleString('ru-RU')} руб.\n` +
            `⏱ <b>Продолжительность:</b> ${priceData.duration_hours} часа\n` +
            `📸 <b>Количество фото:</b> ${priceData.photos_count}\n` +
            `📍 <b>Локации:</b> ${priceData.locations_count}\n\n` +
            `❗️ <b>Для изменения цен используйте админ-панель сайта</b>\n` +
            `🌐 Перейдите в раздел "Управление ценами"`,
      keyboard: {
        inline_keyboard: [
          [{ text: '🔙 К списку тарифов', callback_data: 'edit_pricing' }],
          [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  return { getPricingList, getEditPricingList, handlePriceEdit }
}
