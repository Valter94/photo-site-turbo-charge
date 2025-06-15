
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createServicesHandlers = (supabase: SupabaseClient) => {
  const getServicesList = async () => {
    const { data: servicesData, error } = await supabase
      .from('additional_services')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error

    let servicesList = `🛠 <b>Управление услугами</b>\n\n`
    if (servicesData && servicesData.length > 0) {
      servicesData.forEach((item, index) => {
        servicesList += `${index + 1}. <b>${item.name}</b>\n`
        servicesList += `   💵 ${item.price} руб.\n`
        servicesList += `   📝 ${item.description || 'Без описания'}\n\n`
      })
    } else {
      servicesList += `Дополнительные услуги не добавлены\n\n`
    }

    return {
      text: servicesList,
      keyboard: {
        inline_keyboard: [
          [
            { text: '✏️ Изменить услуги', callback_data: 'edit_services' },
            { text: '➕ Добавить услугу', callback_data: 'add_service' }
          ],
          [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
      }
    }
  }

  return { getServicesList }
}
