
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSecuritySettings = () => {
  return useQuery({
    queryKey: ['security_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useUpdateSecuritySetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ setting_key, setting_value }: { setting_key: string; setting_value: any }) => {
      const { data, error } = await supabase
        .from('security_settings')
        .upsert({
          setting_key,
          setting_value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security_settings'] });
      toast({
        title: "Успешно",
        description: "Настройки безопасности обновлены",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки безопасности",
        variant: "destructive"
      });
    }
  });
};
