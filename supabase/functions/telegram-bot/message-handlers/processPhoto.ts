
export const processPhoto = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, menuHandlers, supabase } = deps
  const photo = message.photo
  let session = getSession(userId)

  console.log('[processPhoto] Состояние сессии до:', session);

  if (!session) {
    await telegramAPI.sendMessage(
      chatId,
      `📸 <b>Чтобы добавить фото, начните с меню 👇</b>\n\n`+
      `1️⃣ Нажмите "📸 Добавить в портфолио" или "📍 Добавить локацию"\n` +
      `2️⃣ Затем отправьте фото.\n\n` +
      `Выберите действие:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  if (session.step !== 'waiting_photo') {
    console.log(`[processPhoto] Фото получено не на своем step: session.step=${session.step}`);
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Сейчас фото не требуется.</b>\n\nСледуйте инструкциям или начните заново:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  const largestPhoto = photo[photo.length - 1]
  const botToken = deps.botToken;
  
  try {
    // Получаем информацию о файле
    const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`);
    const fileInfo = await fileResponse.json();
    
    if (!fileInfo.ok) {
      throw new Error('Не удалось получить информацию о файле');
    }

    // Скачиваем файл
    const photoUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
    const photoResponse = await fetch(photoUrl);
    const photoBlob = await photoResponse.blob();

    // Сохраняем в Supabase Storage
    const fileName = `telegram-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = session.action_type === 'add_portfolio' ? `portfolio/${fileName}` : `locations/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, photoBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Ошибка загрузки в Storage:', uploadError);
      await telegramAPI.sendMessage(chatId, '❌ Ошибка сохранения фото. Попробуйте снова.');
      return;
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const permanentImageUrl = urlData.publicUrl;

    // Обновляем сессию с постоянной ссылкой
    session.data = session.data || {};
    session.data.image_url = permanentImageUrl;
    session.data.original_telegram_file_id = largestPhoto.file_id;
    session.step = 'waiting_title';
    setSession(userId, session);

    console.log('[processPhoto] Фото успешно сохранено:', permanentImageUrl);

    // Отправляем превью сохранённого фото
    await telegramAPI.sendPhoto(
      chatId,
      permanentImageUrl,
      "✅ <b>Фото сохранено!</b>\n\n📸 Превью сохранённого изображения:"
    );

    await telegramAPI.sendMessage(
      chatId,
      `✅ <b>Фото получено и сохранено!</b>\n\n<b>Шаг 2: Введите название</b>\nОтправьте название (3–100 символов):`,
      {
        inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
      }
    );

  } catch (error) {
    console.error('[processPhoto] Ошибка обработки фото:', error);
    await telegramAPI.sendMessage(
      chatId,
      `❌ <b>Ошибка обработки фото</b>\n\nПопробуйте отправить фото снова или обратитесь к администратору.`,
      menuHandlers.getMainMenu()
    );
  }
}
