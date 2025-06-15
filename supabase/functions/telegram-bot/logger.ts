
export const createLogger = (context: string) => {
  const log = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
    const timestamp = new Date().toISOString()
    const prefix = {
      info: '✅',
      warn: '⚠️',
      error: '❌'
    }[level]
    
    console.log(`${prefix} [${timestamp}] [${context}] ${message}`)
    if (data) {
      console.log(JSON.stringify(data, null, 2))
    }
  }

  return {
    info: (message: string, data?: any) => log('info', message, data),
    warn: (message: string, data?: any) => log('warn', message, data),
    error: (message: string, data?: any) => log('error', message, data)
  }
}
