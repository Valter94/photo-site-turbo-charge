import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Search,
  Image as ImageIcon,
  Smartphone,
  Clock,
  Shield,
  Globe,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OptimizationItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'seo' | 'performance' | 'accessibility' | 'security' | 'mobile';
  status: 'pending' | 'completed' | 'failed';
  impact: number; // 1-10
  effort: number; // 1-10
  icon: any;
}

const SiteOptimizer = () => {
  const [optimizations, setOptimizations] = useState<OptimizationItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    performSiteAnalysis();
  }, []);

  const performSiteAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Симуляция анализа сайта
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResults: OptimizationItem[] = [
      // SEO оптимизации
      {
        id: 'meta-descriptions',
        title: 'Добавить мета-описания',
        description: 'Добавьте уникальные мета-описания для всех страниц для улучшения CTR в поисковой выдаче',
        priority: 'high',
        category: 'seo',
        status: 'pending',
        impact: 8,
        effort: 3,
        icon: Search
      },
      {
        id: 'alt-tags',
        title: 'Альтернативный текст для изображений',
        description: 'Добавьте alt теги ко всем изображениям портфолио для лучшей индексации',
        priority: 'high',
        category: 'seo',
        status: 'pending',
        impact: 7,
        effort: 4,
        icon: ImageIcon
      },
      {
        id: 'structured-data',
        title: 'Микроразметка Schema.org',
        description: 'Добавьте структурированные данные для услуг фотографа и отзывов',
        priority: 'medium',
        category: 'seo',
        status: 'pending',
        impact: 6,
        effort: 6,
        icon: Globe
      },
      
      // Производительность
      {
        id: 'image-optimization',
        title: 'Оптимизация изображений',
        description: 'Сжатие и конвертация изображений в WebP формат для ускорения загрузки',
        priority: 'high',
        category: 'performance',
        status: 'pending',
        impact: 9,
        effort: 5,
        icon: Zap
      },
      {
        id: 'lazy-loading',
        title: 'Ленивая загрузка',
        description: 'Внедрить ленивую загрузку для изображений портфолио',
        priority: 'medium',
        category: 'performance',
        status: 'completed',
        impact: 7,
        effort: 3,
        icon: Clock
      },
      
      // Мобильная оптимизация
      {
        id: 'mobile-navigation',
        title: 'Мобильная навигация',
        description: 'Улучшить навигацию на мобильных устройствах',
        priority: 'medium',
        category: 'mobile',
        status: 'pending',
        impact: 6,
        effort: 4,
        icon: Smartphone
      },
      
      // Безопасность
      {
        id: 'security-headers',
        title: 'Заголовки безопасности',
        description: 'Добавить CSP и другие заголовки безопасности',
        priority: 'medium',
        category: 'security',
        status: 'pending',
        impact: 5,
        effort: 3,
        icon: Shield
      },
      
      // Доступность
      {
        id: 'accessibility-audit',
        title: 'Аудит доступности',
        description: 'Улучшить доступность для пользователей с ограниченными возможностями',
        priority: 'low',
        category: 'accessibility',
        status: 'pending',
        impact: 4,
        effort: 5,
        icon: Users
      }
    ];

    setOptimizations(analysisResults);
    
    // Расчет общего скора
    const completedOptimizations = analysisResults.filter(opt => opt.status === 'completed');
    const score = Math.round((completedOptimizations.length / analysisResults.length) * 100);
    setOverallScore(score);
    
    setIsAnalyzing(false);
    
    toast({
      title: "Анализ завершен",
      description: `Найдено ${analysisResults.length} рекомендаций для оптимизации`
    });
  };

  const executeOptimization = async (optimizationId: string) => {
    const optimization = optimizations.find(opt => opt.id === optimizationId);
    if (!optimization) return;

    // Обновляем статус на "выполняется"
    setOptimizations(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, status: 'pending' }
          : opt
      )
    );

    // Симуляция выполнения оптимизации
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Обновляем статус на "завершено"
    setOptimizations(prev => 
      prev.map(opt => 
        opt.id === optimizationId 
          ? { ...opt, status: 'completed' }
          : opt
      )
    );

    // Пересчитываем общий скор
    const updatedOptimizations = optimizations.map(opt => 
      opt.id === optimizationId ? { ...opt, status: 'completed' as const } : opt
    );
    const completedCount = updatedOptimizations.filter(opt => opt.status === 'completed').length;
    const newScore = Math.round((completedCount / updatedOptimizations.length) * 100);
    setOverallScore(newScore);

    toast({
      title: "Оптимизация выполнена",
      description: optimization.title
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seo': return Search;
      case 'performance': return Zap;
      case 'mobile': return Smartphone;
      case 'security': return Shield;
      case 'accessibility': return Users;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'seo': return 'text-blue-600';
      case 'performance': return 'text-green-600';
      case 'mobile': return 'text-purple-600';
      case 'security': return 'text-red-600';
      case 'accessibility': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const groupedOptimizations = optimizations.reduce((groups, opt) => {
    if (!groups[opt.category]) {
      groups[opt.category] = [];
    }
    groups[opt.category].push(opt);
    return groups;
  }, {} as Record<string, OptimizationItem[]>);

  const categoryNames = {
    seo: 'SEO Оптимизация',
    performance: 'Производительность',
    mobile: 'Мобильная версия',
    security: 'Безопасность',
    accessibility: 'Доступность'
  };

  return (
    <div className="space-y-6">
      {/* Общий скор */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Общий скор оптимизации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-green-600">{overallScore}%</div>
            <Button 
              onClick={performSiteAnalysis} 
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? 'Анализируем...' : 'Повторный анализ'}
            </Button>
          </div>
          <Progress value={overallScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Выполнено {optimizations.filter(opt => opt.status === 'completed').length} из {optimizations.length} рекомендаций
          </p>
        </CardContent>
      </Card>

      {/* Рекомендации по категориям */}
      {Object.entries(groupedOptimizations).map(([category, opts]) => {
        const CategoryIcon = getCategoryIcon(category);
        const categoryColor = getCategoryColor(category);
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${categoryColor}`}>
                <CategoryIcon className="h-5 w-5" />
                {categoryNames[category as keyof typeof categoryNames]}
                <Badge variant="outline" className="ml-auto">
                  {opts.filter(opt => opt.status === 'completed').length}/{opts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opts.map((optimization) => {
                  const IconComponent = optimization.icon;
                  return (
                    <div key={optimization.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <IconComponent className="h-5 w-5 mt-1 text-gray-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{optimization.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={getPriorityColor(optimization.priority)}
                              >
                                {optimization.priority === 'high' ? 'Высокий' : 
                                 optimization.priority === 'medium' ? 'Средний' : 'Низкий'}
                              </Badge>
                              {optimization.status === 'completed' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {optimization.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Влияние: {optimization.impact}/10</span>
                              <span>Сложность: {optimization.effort}/10</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {optimization.status === 'completed' ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Выполнено
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => executeOptimization(optimization.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Исправить
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Быстрые улучшения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Рекомендации для быстрого улучшения:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Добавьте alt теги к изображениям портфолио</li>
                <li>• Оптимизируйте мета-описания страниц</li>
                <li>• Включите сжатие изображений</li>
                <li>• Добавьте микроразметку для услуг</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteOptimizer;