
export const processStart = async (deps: any, { chatId }: { chatId: number }) => {
  try {
    console.log("▶️ processStart invoked для чата:", chatId);
    // Проверяем наличие необходимых зависимостей
    if (!deps || !deps.telegramAPI || !deps.menuHandlers) {
      console.error("❌ Не хватает зависимостей в processStart", deps);
      return;
    }
    await deps.telegramAPI.sendMessage(
      chatId,
      `🤖 <b>Добро пожаловать!</b>\n\nВы можете добавить фото в портфолио или локацию пошагово 👇\n\nЕсли что-то не работает, нажмите /start ещё раз или попробуйте перезапустить бота.`,
      deps.menuHandlers.getMainMenu()
    );
    console.log("✅ Сообщение приветствия отправлено для чата:", chatId);
  } catch (error) {
    console.error('Ошибка в processStart:', error);
    try {
      await deps.telegramAPI.sendMessage(
        chatId,
        `❌ Ошибка запуска бота. Попробуйте позже или обратитесь к администратору.`
      );
    } catch (e2) {
      // Вдруг даже отправка сообщения невозможна
      console.error("Ошибка при отправке ошибки в processStart", e2);
    }
  }
};
