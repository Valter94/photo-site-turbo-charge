
// Простой кэш в памяти для часто запрашиваемых данных
const cache = new Map<string, { data: any, expires: number }>()

export const createCacheManager = () => {
  const set = (key: string, data: any, ttlMinutes = 5) => {
    const expires = Date.now() + (ttlMinutes * 60 * 1000)
    cache.set(key, { data, expires })
  }

  const get = (key: string) => {
    const cached = cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expires) {
      cache.delete(key)
      return null
    }
    
    return cached.data
  }

  const clear = (pattern?: string) => {
    if (pattern) {
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      cache.clear()
    }
  }

  const cleanup = () => {
    const now = Date.now()
    for (const [key, value] of cache.entries()) {
      if (now > value.expires) {
        cache.delete(key)
      }
    }
  }

  // Очистка каждые 10 минут
  setInterval(cleanup, 10 * 60 * 1000)

  return { set, get, clear, cleanup }
}
