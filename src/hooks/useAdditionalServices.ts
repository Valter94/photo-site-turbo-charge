
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdditionalServices = () => {
  return useQuery({
    queryKey: ['additional_services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('additional_services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useUpdateAdditionalService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...service }: any) => {
      const { data, error } = await supabase
        .from('additional_services')
        .upsert({ id, ...service })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional_services'] });
    }
  });
};

export const useDeleteAdditionalService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('additional_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional_services'] });
    }
  });
};
