
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
      console.log('📝 Updating site settings via edge function:', settings);
      
      // Always use the edge function for updates
      const { data, error } = await supabase.functions.invoke('admin-site-settings-upsert', {
        body: settings
      });
      
      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message || 'Failed to update site settings');
      }
      
      if (!data?.success) {
        console.error('❌ Edge function returned error:', data);
        throw new Error(data?.error || 'Failed to update site settings');
      }
      
      console.log('✅ Site settings updated successfully:', data.data);
      return data.data;
    },
    onSuccess: (data) => {
      console.log('✅ Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
    },
    onError: (error: Error) => {
      console.error('❌ Mutation error:', error.message);
    }
  });
};
