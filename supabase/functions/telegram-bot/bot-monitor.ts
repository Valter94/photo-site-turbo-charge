
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createBotMonitor = (supabase: SupabaseClient) => {
  const logBotActivity = async (userId: number, action: string, success: boolean, details?: any) => {
    try {
      await supabase
        .from('bot_activity_logs')
        .insert({
          user_id: userId.toString(),
          action,
          success,
          details: details ? JSON.stringify(details) : null,
          timestamp: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Failed to log bot activity:', error)
    }
  }

  const getBotStats = async () => {
    try {
      const [activityResult, errorsResult] = await Promise.all([
        supabase
          .from('bot_activity_logs')
          .select('*', { count: 'exact', head: true })
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        
        supabase
          .from('bot_activity_logs')
          .select('*', { count: 'exact', head: true })
          .eq('success', false)
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ])

      return {
        totalActivities: activityResult.count || 0,
        errors: errorsResult.count || 0,
        successRate: activityResult.count ? ((activityResult.count - (errorsResult.count || 0)) / activityResult.count * 100).toFixed(1) : '100'
      }
    } catch (error) {
      console.error('Error getting bot stats:', error)
      return {
        totalActivities: 0,
        errors: 0,
        successRate: '0'
      }
    }
  }

  return {
    logBotActivity,
    getBotStats
  }
}
