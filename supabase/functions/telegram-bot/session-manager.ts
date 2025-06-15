
import { UserSession } from './types.ts'

// Храним сессии пользователей в памяти с таймстампами
const userSessions = new Map<number, UserSession>()

// Очищаем старые сессии (старше 30 минут)
export const cleanOldSessions = () => {
  const now = Date.now()
  const thirtyMinutes = 30 * 60 * 1000
  
  for (const [userId, session] of userSessions.entries()) {
    if (now - session.created_at > thirtyMinutes) {
      userSessions.delete(userId)
      console.log(`🧹 Удалена старая сессия для пользователя ${userId}`)
    }
  }
}

export const getSession = (userId: number): UserSession | undefined => {
  return userSessions.get(userId)
}

export const setSession = (userId: number, session: UserSession): void => {
  userSessions.set(userId, session)
}

export const deleteSession = (userId: number): void => {
  userSessions.delete(userId)
}
