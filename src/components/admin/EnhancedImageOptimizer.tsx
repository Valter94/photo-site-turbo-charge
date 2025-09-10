import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useLocations } from '@/hooks/useLocations';
import { 
  Image, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Download,
  Upload,
  Sparkles,
  FileImage
} from 'lucide-react';

interface ImageIssue {
  id: string;
  type: 'portfolio' | 'location';
  title: string;
  imageUrl: string;
  issue: 'broken' | 'slow' | 'low_quality' | 'missing_alt';
  severity: 'high' | 'medium' | 'low';
}

const EnhancedImageOptimizer = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [issues, setIssues] = useState<ImageIssue[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  
  const { data: portfolio } = usePortfolio();
  const { data: locations } = useLocations();

  const russianLocations = [
    'красная площадь',
    'кремль',
    'царицыно',
    'коломенское', 
    'воробьевы горы',
    'вднх',
    'парк горького',
    'сокольники',
    'измайловский парк',
    'александровский сад'
  ];

  const checkImageHealth = async (url: string): Promise<{ isHealthy: boolean; issue?: string }> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return { isHealthy: false, issue: 'broken' };
      }
      
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) {
        return { isHealthy: false, issue: 'slow' };
      }
      
      return { isHealthy: true };
    } catch (error) {
      return { isHealthy: false, issue: 'broken' };
    }
  };

  const scanImages = async () => {
    setIsScanning(true);
    setScanProgress(0);
    const foundIssues: ImageIssue[] = [];
    
    try {
      // Scan portfolio images
      if (portfolio) {
        for (let i = 0; i < portfolio.length; i++) {
          const item = portfolio[i];
          setScanProgress((i / (portfolio.length + (locations?.length || 0))) * 100);
          
          if (item.image_url) {
            const health = await checkImageHealth(item.image_url);
            if (!health.isHealthy) {
              foundIssues.push({
                id: item.id,
                type: 'portfolio',
                title: item.title,
                imageUrl: item.image_url,
                issue: health.issue as any,
                severity: health.issue === 'broken' ? 'high' : 'medium'
              });
            }
          }
        }
      }
      
      // Scan location images
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const location = locations[i];
          setScanProgress(((portfolio?.length || 0) + i) / ((portfolio?.length || 0) + locations.length) * 100);
          
          if (location.image_url) {
            const health = await checkImageHealth(location.image_url);
            if (!health.isHealthy) {
              foundIssues.push({
                id: location.id,
                type: 'location',
                title: location.name,
                imageUrl: location.image_url,
                issue: health.issue as any,
                severity: health.issue === 'broken' ? 'high' : 'medium'
              });
            }
          }
        }
      }
      
      setIssues(foundIssues);
      setScanProgress(100);
      
      toast({
        title: "Сканирование завершено",
        description: `Найдено ${foundIssues.length} проблем с изображениями`,
      });
    } catch (error) {
      toast({
        title: "Ошибка сканирования",
        description: "Не удалось просканировать изображения",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const optimizeImage = async (imageUrl: string, locationName?: string): Promise<string> => {
    try {
      // For Russian locations, try to find a better image
      if (locationName) {
        const locationNameLower = locationName.toLowerCase();
        const isRussianLocation = russianLocations.some(loc => 
          locationNameLower.includes(loc) || loc.includes(locationNameLower)
        );
        
        if (isRussianLocation) {
          // Try to get a new image for this location
          const { data, error } = await supabase.functions.invoke('ai-image-optimizer', {
            body: { 
              action: 'find_location_image',
              locationName: locationName,
              type: 'location'
            }
          });
          
          if (!error && data?.optimizedUrl) {
            return data.optimizedUrl;
          }
        }
      }
      
      // Default optimization through our AI service
      const { data, error } = await supabase.functions.invoke('ai-image-optimizer', {
        body: { 
          action: 'optimize',
          imageUrl: imageUrl,
          options: {
            quality: 85,
            format: 'webp',
            maxWidth: 1200
          }
        }
      });
      
      if (error) throw error;
      return data?.optimizedUrl || imageUrl;
    } catch (error) {
      console.error('Optimization error:', error);
      return imageUrl; // Return original if optimization fails
    }
  };

  const fixAllIssues = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    let fixed = 0;
    
    try {
      for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        setOptimizationProgress((i / issues.length) * 100);
        
        try {
          const newImageUrl = await optimizeImage(
            issue.imageUrl, 
            issue.type === 'location' ? issue.title : undefined
          );
          
          if (newImageUrl !== issue.imageUrl) {
            // Update in database
            if (issue.type === 'portfolio') {
              await supabase
                .from('portfolio')
                .update({ image_url: newImageUrl })
                .eq('id', issue.id);
            } else {
              await supabase
                .from('photoshoot_locations')
                .update({ image_url: newImageUrl })
                .eq('id', issue.id);
            }
            fixed++;
          }
        } catch (error) {
          console.error(`Failed to fix issue for ${issue.title}:`, error);
        }
      }
      
      setOptimizationProgress(100);
      
      toast({
        title: "Оптимизация завершена",
        description: `Исправлено ${fixed} из ${issues.length} проблем`,
      });
      
      // Refresh issues list
      await scanImages();
    } catch (error) {
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось завершить оптимизацию",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">Критично</Badge>;
      case 'medium':
        return <Badge variant="outline">Средне</Badge>;
      case 'low':
        return <Badge variant="secondary">Низко</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getIssueText = (issue: string) => {
    switch (issue) {
      case 'broken':
        return 'Сломанная ссылка';
      case 'slow':
        return 'Медленная загрузка';
      case 'low_quality':
        return 'Низкое качество';
      case 'missing_alt':
        return 'Нет alt-текста';
      default:
        return 'Неизвестная проблема';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span>Умный оптимизатор изображений</span>
          </h2>
          <p className="text-muted-foreground">
            Автоматическое обнаружение и исправление проблем с изображениями
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={scanImages}
            disabled={isScanning || isOptimizing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            Сканировать
          </Button>
          <Button
            onClick={fixAllIssues}
            disabled={isOptimizing || isScanning || issues.length === 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            Исправить все
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileImage className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Всего изображений</p>
                <p className="text-2xl font-bold">
                  {(portfolio?.length || 0) + (locations?.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Проблем найдено</p>
                <p className="text-2xl font-bold text-orange-600">{issues.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Здоровых изображений</p>
                <p className="text-2xl font-bold text-green-600">
                  {((portfolio?.length || 0) + (locations?.length || 0)) - issues.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Оптимизировано</p>
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      {isScanning && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Сканирование изображений...</span>
                <span className="text-sm text-muted-foreground">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {isOptimizing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Оптимизация изображений...</span>
                <span className="text-sm text-muted-foreground">{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Обнаруженные проблемы</CardTitle>
            <CardDescription>
              Список изображений, требующих внимания
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={`${issue.type}-${issue.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {issue.type === 'portfolio' ? 'Портфолио' : 'Локация'} • {getIssueText(issue.issue)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(issue.severity)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {issues.length === 0 && !isScanning && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Все изображения в порядке!</h3>
            <p className="text-muted-foreground">
              Проблем с изображениями не обнаружено. Запустите сканирование для проверки.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Russian Locations Enhancement */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>Умная замена для российских локаций:</strong> Система автоматически находит качественные 
          изображения для популярных мест Москвы, включая Красную площадь, Царицыно, Коломенское, 
          Воробьевы горы и другие знаковые локации.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EnhancedImageOptimizer;