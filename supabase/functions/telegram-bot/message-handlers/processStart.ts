
export const processStart = async (deps: any, { chatId }: { chatId: number }) => {
  await deps.telegramAPI.sendMessage(
    chatId,
    `🤖 <b>Добро пожаловать!</b>\n\nВы можете добавить фото в портфолио или локацию пошагово 👇`,
    deps.menuHandlers.getMainMenu()
  )
}
