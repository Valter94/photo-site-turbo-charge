import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemSetting {
  id: string;
  setting_category: string;
  setting_key: string;
  setting_value: any;
  display_name?: string;
  description?: string;
  setting_type: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = (category?: string) => {
  return useQuery({
    queryKey: ['system_settings', category],
    queryFn: async () => {
      let query = supabase.from('system_settings').select('*');
      
      if (category) {
        query = query.eq('setting_category', category);
      }
      
      const { data, error } = await query.order('setting_category, setting_key');
      
      if (error) {
        console.error('Error fetching system settings:', error);
        throw error;
      }
      
      return data as SystemSetting[];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      category, 
      key, 
      value, 
      displayName, 
      description, 
      type = 'text' 
    }: {
      category: string;
      key: string;
      value: any;
      displayName?: string;
      description?: string;
      type?: string;
    }) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          setting_category: category,
          setting_key: key,
          setting_value: value,
          display_name: displayName,
          description: description,
          setting_type: type,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating system setting:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast({
        title: "Настройки обновлены",
        description: `${data.display_name || data.setting_key} успешно обновлена`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useCreateConfigBackup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      // Get all current settings
      const { data: settings, error: settingsError } = await supabase
        .from('system_settings')
        .select('*');
      
      if (settingsError) throw settingsError;
      
      // Get site settings
      const { data: siteSettings, error: siteError } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (siteError) throw siteError;
      
      // Create backup
      const backupData = {
        system_settings: settings,
        site_settings: siteSettings,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('config_backups')
        .insert({
          backup_name: name,
          backup_data: backupData,
          description: description
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config_backups'] });
      toast({
        title: "Бэкап создан",
        description: "Конфигурация успешно сохранена",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка создания бэкапа",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useConfigBackups = () => {
  return useQuery({
    queryKey: ['config_backups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('config_backups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching config backups:', error);
        throw error;
      }
      
      return data;
    },
  });
};