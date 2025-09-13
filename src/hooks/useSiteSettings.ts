
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      
      console.log('Site settings fetched:', data);
      return data;
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: any) => {
      // Сначала получаем существующую запись
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .single();
      
      if (existing) {
        // Обновляем существующую запись
        const { data, error } = await supabase
          .from('site_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from('site_settings')
          .insert({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
    }
  });
};
