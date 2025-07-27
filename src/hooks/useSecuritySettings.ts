
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the security settings type
interface SecuritySetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSecuritySettings = () => {
  return useQuery({
    queryKey: ['security_settings'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('security_settings')
        .select('*')
        .order('setting_key');
      
      if (error) {
        console.error('Error fetching security settings:', error);
        throw error;
      }
      
      return data as SecuritySetting[];
    }
  });
};

export const useUpdateSecuritySetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ setting_key, setting_value }: { setting_key: string; setting_value: any }) => {
      // Get old value for audit log
      const { data: oldSetting } = await (supabase as any)
        .from('security_settings')
        .select('setting_value')
        .eq('setting_key', setting_key)
        .single();

      const { data, error } = await (supabase as any)
        .from('security_settings')
        .upsert({
          setting_key,
          setting_value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating security setting:', error);
        throw error;
      }

      // Log the action
      await (supabase as any).rpc('log_action', {
        p_action: 'UPDATE',
        p_table_name: 'security_settings',
        p_record_id: data.id,
        p_old_values: oldSetting ? { setting_value: oldSetting.setting_value } : null,
        p_new_values: { setting_value: setting_value }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security_settings'] });
      queryClient.invalidateQueries({ queryKey: ['audit_log'] });
      toast({
        title: "Успешно",
        description: "Настройки безопасности обновлены",
      });
    },
    onError: (error) => {
      console.error('Failed to update security setting:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки безопасности",
        variant: "destructive"
      });
    }
  });
};
