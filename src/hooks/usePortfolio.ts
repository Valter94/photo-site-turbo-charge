
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

// Моковые данные для портфолио с красивыми изображениями
const mockPortfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'Свадьба Анны и Михаила',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop&auto=format',
    description: 'Нежная свадебная церемония в парке Сокольники',
    location: 'Парк Сокольники',
    client_name: 'Анна и Михаил',
    shoot_date: '2024-08-15',
    is_featured: true
  },
  {
    id: '2',
    title: 'Love Story Елены и Дмитрия',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format',
    description: 'Романтическая прогулка по Патриаршим прудам',
    location: 'Патриаршие пруды',
    client_name: 'Елена и Дмитрий',
    shoot_date: '2024-07-20',
    is_featured: true
  },
  {
    id: '3',
    title: 'Семейная фотосессия Петровых',
    category: 'family',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
    description: 'Счастливая семья с детьми в домашней обстановке',
    location: 'Студия',
    client_name: 'Семья Петровых',
    shoot_date: '2024-09-10',
    is_featured: false
  },
  {
    id: '4',
    title: 'Портрет Марии',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&auto=format',
    description: 'Элегантный женский портрет в студийных условиях',
    location: 'Студия Loft',
    client_name: 'Мария С.',
    shoot_date: '2024-06-05',
    is_featured: true
  },
  {
    id: '5',
    title: 'Корпоративная съемка IT-компании',
    category: 'corporate',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
    description: 'Профессиональные портреты команды',
    location: 'Москва-Сити',
    client_name: 'TechCorp',
    shoot_date: '2024-05-18',
    is_featured: false
  },
  {
    id: '6',
    title: 'Свадьба на Красной площади',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&auto=format',
    description: 'Торжественная церемония в самом сердце Москвы',
    location: 'Красная площадь',
    client_name: 'Ольга и Александр',
    shoot_date: '2024-04-22',
    is_featured: true
  },
  {
    id: '7',
    title: 'Материнство',
    category: 'maternity',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae4058c73e28?w=800&h=600&fit=crop&auto=format',
    description: 'Нежная фотосессия будущей мамы',
    location: 'Студия',
    client_name: 'Екатерина Н.',
    shoot_date: '2024-03-15',
    is_featured: false
  },
  {
    id: '8',
    title: 'Романтика на Воробьевых горах',
    category: 'lovestory',
    image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop&auto=format',
    description: 'Love story с панорамным видом на Москву',
    location: 'Воробьевы горы',
    client_name: 'Виктория и Павел',
    shoot_date: '2024-10-01',
    is_featured: true
  },
  {
    id: '9',
    title: 'Детский портрет',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&auto=format',
    description: 'Искренние эмоции маленькой модели',
    location: 'Парк',
    client_name: 'София М.',
    shoot_date: '2024-09-25',
    is_featured: false
  },
  {
    id: '10',
    title: 'Бизнес-портреты',
    category: 'corporate',
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format',
    description: 'Профессиональные портреты для корпоративного сайта',
    location: 'Офис',
    client_name: 'Алексей К.',
    shoot_date: '2024-08-30',
    is_featured: false
  },
  {
    id: '11',
    title: 'Свадебные детали',
    category: 'wedding',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop&auto=format',
    description: 'Нежные детали свадебного дня',
    location: 'Загородный клуб',
    client_name: 'Анастасия и Игорь',
    shoot_date: '2024-07-12',
    is_featured: true
  },
  {
    id: '12',
    title: 'Творческий портрет',
    category: 'portrait',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop&auto=format',
    description: 'Художественный портрет с игрой света и тени',
    location: 'Студия',
    client_name: 'Дарья Л.',
    shoot_date: '2024-06-20',
    is_featured: true
  }
];

export const usePortfolio = () => {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Portfolio fetch error, using mock data:", error);
        return mockPortfolioData;
      }

      // Если нет данных в базе, возвращаем mock данные
      return data && data.length > 0 ? data : mockPortfolioData;
    },
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
    onError: () => {
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
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фотографию",
        variant: "destructive"
      });
    }
  });
};
