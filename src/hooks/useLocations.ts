
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photoshoot_locations')
        .select(`
          *,
          location_categories(name, description)
        `);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useLocationCategories = () => {
  return useQuery({
    queryKey: ['location_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_categories')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });
};
