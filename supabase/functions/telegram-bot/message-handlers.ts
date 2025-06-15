
// Старый файл — теперь просто проксирует в новый корневой обработчик
import { createMessageHandlers as createMainHandlers } from './message-handlers/index.ts'
export const createMessageHandlers = createMainHandlers
