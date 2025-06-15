
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const ensureStorageBucket = async (supabase: SupabaseClient) => {
  try {
    // Проверяем существование bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Ошибка получения списка buckets:', listError)
      return false
    }

    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
    
    if (!imagesBucket) {
      console.log('🪣 Создаем bucket images...')
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      })
      
      if (createError) {
        console.error('❌ Ошибка создания bucket:', createError)
        return false
      }
      
      console.log('✅ Bucket images создан')
    }

    return true
  } catch (error) {
    console.error('❌ Критическая ошибка при работе с storage:', error)
    return false
  }
}
