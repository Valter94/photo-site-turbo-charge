
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  location?: string;
  client_name?: string;
  shoot_date?: string;
  is_featured?: boolean;
  created_at?: string;
}

// Реальные красивые фотографии для портфолио
const mockPortfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'Свадьба в Царицыно',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Роскошная свадебная церемония в историческом парке Царицыно',
    location: 'Царицыно, Москва',
    client_name: 'Анна и Михаил',
    shoot_date: '2024-09-15',
    is_featured: true
  },
  {
    id: '2',
    title: 'Love Story на ВДНХ',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Романтическая фотосессия среди фонтанов ВДНХ',
    location: 'ВДНХ, Москва',
    client_name: 'Елена и Дмитрий',
    shoot_date: '2024-08-20',
    is_featured: true
  },
  {
    id: '3',
    title: 'Портрет в Парке Горького',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Изысканная портретная съемка в центре Москвы',
    location: 'Парк Горького, Москва',
    client_name: 'Мария',
    shoot_date: '2024-10-10',
    is_featured: true
  },
  {
    id: '4',
    title: 'Семейная фотосессия в Коломенском',
    category: 'family',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Теплые семейные моменты на фоне древних храмов',
    location: 'Коломенское, Москва',
    client_name: 'Семья Петровых',
    shoot_date: '2024-10-05',
    is_featured: true
  },
  {
    id: '5',
    title: 'Свадьба в Архангельском',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Торжественная церемония в дворцовом парке',
    location: 'Архангельское, Подмосковье',
    client_name: 'Ольга и Сергей',
    shoot_date: '2024-07-28',
    is_featured: true
  },
  {
    id: '6',
    title: 'Love Story в Кусково',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Романтическая прогулка по французскому парку',
    location: 'Кусково, Москва',
    client_name: 'Виктория и Артем',
    shoot_date: '2024-09-22',
    is_featured: true
  },
  {
    id: '7',
    title: 'Материнство в Сокольниках',
    category: 'maternity',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae4058c73e28?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Нежная съемка в ожидании малыша',
    location: 'Парк Сокольники, Москва',
    client_name: 'Алина',
    shoot_date: '2024-08-15',
    is_featured: true
  },
  {
    id: '8',
    title: 'Детская фотосессия на Воробьевых горах',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Искренние детские эмоции с видом на Москву',
    location: 'Воробьевы горы, Москва',
    client_name: 'София',
    shoot_date: '2024-09-25',
    is_featured: false
  },
  {
    id: '9',
    title: 'Свадьба в Измайлово',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Сказочная церемония в царской резиденции',
    location: 'Измайлово, Москва',
    client_name: 'Анастасия и Игорь',
    shoot_date: '2024-07-12',
    is_featured: true
  },
  {
    id: '10',
    title: 'Портрет на Красной площади',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Эксклюзивная съемка в сердце России',
    location: 'Красная площадь, Москва',
    client_name: 'Дарья',
    shoot_date: '2024-06-20',
    is_featured: true
  },
  {
    id: '11',
    title: 'Love Story на Патриарших',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Романтика в самом центре Москвы',
    location: 'Патриаршие пруды, Москва',
    client_name: 'Максим и Юлия',
    shoot_date: '2024-06-30',
    is_featured: true
  },
  {
    id: '12',
    title: 'Семья в Битцевском парке',
    category: 'family',
    image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop&auto=format&q=80',
    description: 'Счастливые моменты на природе',
    location: 'Битцевский парк, Москва',
    client_name: 'Семья Смирновых',
    shoot_date: '2024-05-18',
    is_featured: false
  }
];

export const usePortfolio = () => {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      try {
        console.log('Загружаем портфолио из базы данных...');
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.log("Ошибка загрузки портфолио, используем моковые данные:", error);
          return mockPortfolioData;
        }

        if (!data || data.length === 0) {
          console.log("База данных пуста, используем моковые данные");
          return mockPortfolioData;
        }

        console.log(`Загружено ${data.length} элементов портфолио из базы данных`);
        return data;
      } catch (error) {
        console.error("Критическая ошибка загрузки портфолио:", error);
        return mockPortfolioData;
      }
    },
    retry: (failureCount, error) => {
      if (failureCount >= 3) {
        console.log("Максимальное количество попыток достигнуто, используем моковые данные");
        return false;
      }
      return true;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (portfolioData: any) => {
      const { data, error } = await supabase
        .from('portfolio')
        .update(portfolioData)
        .eq('id', portfolioData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно",
        description: "Фотография обновлена",
      });
    },
    onError: (error) => {
      console.error('Update portfolio error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фотографию",
        variant: "destructive"
      });
    }
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно",
        description: "Фотография удалена",
      });
    },
    onError: (error) => {
      console.error('Delete portfolio error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фотографию",
        variant: "destructive"
      });
    }
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (portfolioData: Omit<PortfolioItem, 'id' | 'created_at'>) => {
      try {
        console.log('Создаем новый элемент портфолио:', portfolioData);
        const { data, error } = await supabase
          .from('portfolio')
          .insert(portfolioData)
          .select()
          .single();
        
        if (error) {
          console.error('Database insert error:', error);
          throw error;
        }
        
        console.log('Элемент портфолио успешно создан:', data);
        return data;
      } catch (error) {
        console.error('Create portfolio error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Успешно!",
        description: "Фотография добавлена в портфолио",
      });
    },
    onError: (error: any) => {
      console.error('Create portfolio mutation error:', error);
      const errorMessage = error?.message || 'Не удалось добавить фотографию';
      toast({
        title: "Ошибка добавления",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });
};
