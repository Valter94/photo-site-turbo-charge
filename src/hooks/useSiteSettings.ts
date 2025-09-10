
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single(); // Changed from maybeSingle to single since we only have one record
      
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
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
    }
  });
};
