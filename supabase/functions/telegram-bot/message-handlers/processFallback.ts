
export const processFallback = async (deps: any, { message, chatId, userId }: any) => {
  await deps.telegramAPI.sendMessage(
    chatId,
    `👋 <b>Выберите действие из меню:</b>`,
    deps.menuHandlers.getMainMenu()
  )
}
