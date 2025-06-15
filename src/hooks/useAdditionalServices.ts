
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockAdditionalServices } from '@/data/mockAdditionalServices';

export const useAdditionalServices = () => {
  return useQuery({
    queryKey: ['additional_services'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('additional_services')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        
        // Если данных нет в базе, используем моковые данные
        if (!data || data.length === 0) {
          console.log('Using mock additional services data');
          return mockAdditionalServices;
        }
        
        return data;
      } catch (error) {
        console.log('Error fetching from database, using mock data:', error);
        return mockAdditionalServices;
      }
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
