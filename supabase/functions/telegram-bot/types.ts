
export interface TelegramUpdate {
  message?: {
    chat: { id: number }
    text?: string
    photo?: Array<{ file_id: string, file_size: number }>
    caption?: string
    from: { id: number, username?: string, first_name?: string }
  }
  callback_query?: {
    id: string
    from: { id: number, username?: string, first_name?: string }
    message: { chat: { id: number }, message_id: number }
    data: string
  }
}

export interface UserSession {
  step: string
  data: any
  type: 'portfolio' | 'location' | 'pricing' | 'service'
  created_at: number
}
