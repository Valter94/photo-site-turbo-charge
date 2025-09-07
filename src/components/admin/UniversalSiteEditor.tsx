import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Eye, EyeOff, Palette, Type, Globe, BarChart3, Phone, Mail, MapPin } from 'lucide-react';

interface SiteConfiguration {
  id: string;
  section: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  display_name: string;
  description: string;
  category: string;
  is_visible: boolean;
  validation_rules?: any;
}

const UniversalSiteEditor = () => {
  const [changes, setChanges] = useState<Record<string, any>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: configurations, isLoading } = useQuery({
    queryKey: ['site_configuration'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_configuration')
        .select('*')
        .order('category, section, setting_key');
      
      if (error) throw error;
      return data as SiteConfiguration[];
    }
  });

  const updateConfiguration = useMutation({
    mutationFn: async ({ id, setting_value }: { id: string; setting_value: any }) => {
      const { error } = await supabase
        .from('site_configuration')
        .update({ setting_value, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE',
        p_resource: 'site_configuration',
        p_resource_id: id,
        p_details: { setting_value }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_configuration'] });
      toast.success('Настройка обновлена');
    },
    onError: (error) => {
      toast.error('Ошибка обновления: ' + error.message);
    }
  });

  const handleChange = (configId: string, value: any) => {
    setChanges(prev => ({ ...prev, [configId]: value }));
  };

  const handleSave = (config: SiteConfiguration) => {
    const newValue = changes[config.id] ?? config.setting_value;
    updateConfiguration.mutate({ id: config.id, setting_value: newValue });
    setChanges(prev => {
      const updated = { ...prev };
      delete updated[config.id];
      return updated;
    });
  };

  const renderInput = (config: SiteConfiguration) => {
    const currentValue = changes[config.id] ?? (typeof config.setting_value === 'string' ? JSON.parse(config.setting_value) : config.setting_value);
    const hasChanges = config.id in changes;

    switch (config.setting_type) {
      case 'text':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleChange(config.id, e.target.value)}
            placeholder={config.description}
            className={hasChanges ? 'border-yellow-500' : ''}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handleChange(config.id, e.target.value)}
            placeholder={config.description}
            className={hasChanges ? 'border-yellow-500' : ''}
            rows={3}
          />
        );
      
      case 'email':
        return (
          <Input
            type="email"
            value={currentValue || ''}
            onChange={(e) => handleChange(config.id, e.target.value)}
            placeholder={config.description}
            className={hasChanges ? 'border-yellow-500' : ''}
          />
        );
      
      case 'phone':
        return (
          <Input
            type="tel"
            value={currentValue || ''}
            onChange={(e) => handleChange(config.id, e.target.value)}
            placeholder={config.description}
            className={hasChanges ? 'border-yellow-500' : ''}
          />
        );
      
      case 'url':
        return (
          <Input
            type="url"
            value={currentValue || ''}
            onChange={(e) => handleChange(config.id, e.target.value)}
            placeholder={config.description}
            className={hasChanges ? 'border-yellow-500' : ''}
          />
        );
      
      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={currentValue?.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/) ? 
                `hsl(${currentValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)[1]}, ${currentValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)[2]}%, ${currentValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)[3]}%)` : 
                '#3b82f6'}
              onChange={(e) => {
                const hex = e.target.value;
                // Convert hex to HSL
                const r = parseInt(hex.slice(1, 3), 16) / 255;
                const g = parseInt(hex.slice(3, 5), 16) / 255;
                const b = parseInt(hex.slice(5, 7), 16) / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h: number, s: number, l = (max + min) / 2;

                if (max === min) {
                  h = s = 0;
                } else {
                  const d = max - min;
                  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                  switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                    default: h = 0;
                  }
                  h /= 6;
                }

                const hslValue = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
                handleChange(config.id, hslValue);
              }}
              className="w-16"
            />
            <Input
              value={currentValue || ''}
              onChange={(e) => handleChange(config.id, e.target.value)}
              placeholder="hsl(220, 90%, 56%)"
              className={`flex-1 ${hasChanges ? 'border-yellow-500' : ''}`}
            />
          </div>
        );
      
      default:
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleChange(config.id, e.target.value)}
            placeholder={config.description}
            className={hasChanges ? 'border-yellow-500' : ''}
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content': return Type;
      case 'design': return Palette;
      case 'seo': return Globe;
      case 'analytics': return BarChart3;
      case 'contact': return Phone;
      case 'social': return Mail;
      default: return MapPin;
    }
  };

  const groupedConfigs = configurations?.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = {};
    }
    if (!acc[config.category][config.section]) {
      acc[config.category][config.section] = [];
    }
    acc[config.category][config.section].push(config);
    return acc;
  }, {} as Record<string, Record<string, SiteConfiguration[]>>) || {};

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Загрузка настроек...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Универсальный редактор сайта</h2>
          <p className="text-muted-foreground">
            Полный контроль над всеми аспектами сайта
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <Switch
              checked={previewMode}
              onCheckedChange={setPreviewMode}
            />
            <EyeOff className="h-4 w-4" />
          </div>
          <Badge variant="secondary">
            {Object.keys(changes).length} изменений
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {Object.keys(groupedConfigs).map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <TabsTrigger key={category} value={category}>
                <Icon className="h-4 w-4 mr-2" />
                {category === 'content' && 'Контент'}
                {category === 'design' && 'Дизайн'}
                {category === 'seo' && 'SEO'}
                {category === 'analytics' && 'Аналитика'}
                {category === 'contact' && 'Контакты'}
                {category === 'social' && 'Соцсети'}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(groupedConfigs).map(([category, sections]) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {Object.entries(sections).map(([section, configs]) => (
              <Card key={section}>
                <CardHeader>
                  <CardTitle className="capitalize">{section}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {configs.map((config) => (
                    <div key={config.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={config.id} className="text-sm font-medium">
                          {config.display_name}
                        </Label>
                        <div className="flex items-center gap-2">
                          {config.id in changes && (
                            <Badge variant="outline" className="text-xs">
                              Изменено
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSave(config)}
                            disabled={!(config.id in changes)}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {renderInput(config)}
                      
                      {config.description && (
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      )}
                      
                      <Separator className="my-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {Object.keys(changes).length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Несохраненные изменения</h3>
                <p className="text-sm text-muted-foreground">
                  У вас есть {Object.keys(changes).length} несохраненных изменений
                </p>
              </div>
              <Button
                onClick={() => {
                  configurations?.forEach(config => {
                    if (config.id in changes) {
                      handleSave(config);
                    }
                  });
                }}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Сохранить все изменения
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversalSiteEditor;