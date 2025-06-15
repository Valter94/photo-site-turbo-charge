
export const processPhoto = async (deps: any, { message, chatId, userId }: any) => {
  const { telegramAPI, getSession, setSession, menuHandlers, screenshotService } = deps
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
      `❌ <b>Сейчас фото не требуется.</b>\n\nСледуйте инструкции или начните заново:`,
      menuHandlers.getMainMenu()
    )
    return
  }

  const largestPhoto = photo[photo.length - 1]
  session.data = session.data || {};
  session.data.photo_file_id = largestPhoto.file_id
  session.step = 'waiting_title'
  setSession(userId, session)

  // Запросить ссылку на файл Telegram
  const botToken = deps.botToken;
  let fileUrl: string | null = null;
  let screenshotPreview: any = null;
  let screenshotError: string | null = null;

  try {
    const fileId = largestPhoto.file_id;
    const fileResp = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    const fileInfo = await fileResp.json();
    if (fileInfo.ok && fileInfo.result && fileInfo.result.file_path) {
      fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
      console.log('[processPhoto] Получен fileUrl для скрина:', fileUrl);

      // Получить скриншот через сервис
      if (screenshotService) {
        try {
          screenshotPreview = await screenshotService.takeScreenshot(fileUrl);
          if (screenshotPreview && typeof screenshotPreview === "string") {
            // Отправить ссылку на скриншот
            await telegramAPI.sendPhoto(
              chatId,
              screenshotPreview,
              "📸 Ваш превью-скриншот (предпросмотр):"
            );
            console.log("[processPhoto] Скриншот успешно отправлен в чат:", screenshotPreview);
          } else if (screenshotPreview instanceof Uint8Array) {
            // Отправить буфер (альтернативно)
            await telegramAPI.sendPhoto(
              chatId,
              screenshotPreview,
              "📸 Ваш превью-скриншот (предпросмотр):"
            );
            console.log("[processPhoto] Скриншот (Uint8Array) отправлен.");
          } else {
            screenshotError = "Screenshot not available";
          }
        } catch (err) {
          screenshotError = "Ошибка screenshotService: " + err?.message;
        }
        if (screenshotError) {
          await telegramAPI.sendMessage(chatId, "Не удалось сгенерировать скриншот, но фото принято!");
          console.warn("[processPhoto] Ошибка генерации скриншота:", screenshotError);
        }
      }
    }
  } catch (err) {
    console.log('[processPhoto] Не удалось получить fileUrl или создать скрин:', err);
    await telegramAPI.sendMessage(chatId, "Ошибка при создании скрина, фото принято!");
  }

  console.log('[processPhoto] Сессия после добавления фото:', session);

  await telegramAPI.sendMessage(
    chatId,
    `✅ <b>Фото получено!</b>\n\n<b>Шаг 2: Введите название</b>\nОтправьте название (3–100 символов):`,
    {
      inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel' }]]
    }
  )
}
