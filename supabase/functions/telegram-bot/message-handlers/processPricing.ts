
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const processPricing = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, deleteSession, supabase } = deps
  const text: string = (message.text || '').trim()
  const session = getSession(userId)

  if (!session || session.step !== 'waiting_pricing') {
    await telegramAPI.sendMessage(
      chatId,
      '❌ <b>Сейчас добавление цен не требуется.</b>\n\nНачните с меню «Управление ценами».',
    )
    return
  }

  try {
    // Простейший парсер формата "Ключ: значение" по строкам
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    const data: Record<string, string> = {}
    for (const line of lines) {
      const [k, ...rest] = line.split(':')
      if (!k || rest.length === 0) continue
      data[k.toLowerCase()] = rest.join(':').trim()
    }

    const serviceType = data['название'] || data['пакет'] || data['услуга']
    const priceStr = data['цена']
    const hoursStr = data['часы'] || data['длительность']
    const photosStr = data['фото'] || data['фотографии']
    const locationsStr = data['локации']

    if (!serviceType || !priceStr || !hoursStr) {
      await telegramAPI.sendMessage(
        chatId,
        '⚠️ <b>Недостаточно данных.</b> Укажите минимум Название, Цена, Часы.\n\nПример:\n<code>Название: Свадебная съемка\nЦена: 15000\nЧасы: 3\nФото: 50\nЛокации: 2</code>'
      )
      return
    }

    const price = Number(priceStr.replace(/\s|₽/g, ''))
    const duration_hours = Number(hoursStr)
    const photos_count = photosStr ? Number(photosStr) : null
    const locations_count = locationsStr ? Number(locationsStr) : null

    if (Number.isNaN(price) || Number.isNaN(duration_hours)) {
      await telegramAPI.sendMessage(chatId, '❌ Неверные числа. Проверьте поля Цена и Часы.')
      return
    }

    const payload: any = {
      service_type: serviceType,
      price,
      duration_hours,
      is_active: true,
    }
    if (photos_count !== null) payload.photos_count = photos_count
    if (locations_count !== null) payload.locations_count = locations_count

    const { error } = await (supabase as SupabaseClient)
      .from('pricing')
      .insert(payload)

    if (error) throw error

    deleteSession(userId)

    await telegramAPI.sendMessage(
      chatId,
      `✅ <b>Пакет добавлен!</b>\n\n` +
      `📦 ${serviceType}\n💵 ${price} ₽\n⏰ ${duration_hours} ч${duration_hours > 1 ? 'а' : ''}`
    )

    // Скриншот раздела цен
    try {
      const targetUrl = deps.siteUrl + '/services'
      const simpleShot = await deps.screenshotService.takeSimpleScreenshot(targetUrl)
      if (simpleShot) {
        await telegramAPI.sendPhoto(
          chatId,
          simpleShot,
          `🖼️ <b>Предпросмотр обновленного раздела «Услуги и цены»</b>\n${targetUrl}`
        )
      } else {
        const shotUrl = await deps.screenshotService.takeScreenshot(targetUrl)
        if (shotUrl) {
          await telegramAPI.sendPhoto(
            chatId,
            shotUrl,
            `🖼️ <b>Предпросмотр обновленного раздела «Услуги и цены»</b>\n${targetUrl}`
          )
        }
      }
    } catch (e) {
      console.warn('[processPricing] Не удалось отправить скриншот:', e)
    }
  } catch (err: any) {
    console.error('[processPricing] Ошибка добавления цены:', err)
    await telegramAPI.sendMessage(
      chatId,
      '❌ Ошибка при добавлении пакета. Проверьте формат данных и попробуйте снова.'
    )
  }
}
