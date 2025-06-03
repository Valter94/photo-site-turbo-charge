
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLocationActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createLocation = useMutation({
    mutationFn: async (locationData: any) => {
      const { data, error } = await supabase
        .from('photoshoot_locations')
        .insert(locationData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Успешно",
        description: "Локация добавлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить локацию",
        variant: "destructive"
      });
    }
  });

  const updateLocation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('photoshoot_locations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Успешно",
        description: "Локация обновлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить локацию",
        variant: "destructive"
      });
    }
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('photoshoot_locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({
        title: "Успешно",
        description: "Локация удалена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить локацию",
        variant: "destructive"
      });
    }
  });

  const createCategory = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('location_categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location_categories'] });
      toast({
        title: "Успешно",
        description: "Категория добавлена",
      });
    }
  });

  return {
    createLocation,
    updateLocation,
    deleteLocation,
    createCategory
  };
};
