import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSystemSettings, useUpdateSystemSetting, useCreateConfigBackup, useConfigBackups } from '@/hooks/useSystemSettings';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Upload, RefreshCw, Globe, Search, Palette, Phone, Shield, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const UniversalSiteEditor = () => {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: systemSettings, isLoading: systemLoading } = useSystemSettings();
  const { data: siteSettings, isLoading: siteLoading } = useSiteSettings();
  const { data: backups } = useConfigBackups();
  
  const updateSystemSetting = useUpdateSystemSetting();
  const updateSiteSettings = useUpdateSiteSettings();
  const createBackup = useCreateConfigBackup();

  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  const handleSystemSettingChange = (category: string, key: string, value: any) => {
    const settingKey = `${category}.${key}`;
    setLocalSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  const handleSaveSystemSetting = async (category: string, key: string, setting: any) => {
    const settingKey = `${category}.${key}`;
    const value = localSettings[settingKey] !== undefined ? localSettings[settingKey] : setting.setting_value;
    
    await updateSystemSetting.mutateAsync({
      category,
      key,
      value: JSON.stringify(value),
      displayName: setting.display_name,
      description: setting.description,
      type: setting.setting_type
    });
    
    // Remove from local state after saving
    setLocalSettings(prev => {
      const newState = { ...prev };
      delete newState[settingKey];
      return newState;
    });
  };

  const handleCreateBackup = async () => {
    const backupName = `Backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
    await createBackup.mutateAsync({
      name: backupName,
      description: 'Автоматический бэкап конфигурации'
    });
  };

  const groupedSettings = systemSettings?.reduce((acc, setting) => {
    if (!acc[setting.setting_category]) {
      acc[setting.setting_category] = [];
    }
    acc[setting.setting_category].push(setting);
    return acc;
  }, {} as Record<string, typeof systemSettings>) || {};

  const filteredSettings = Object.entries(groupedSettings).filter(([category, settings]) =>
    searchQuery === '' || 
    category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    settings.some(s => 
      s.setting_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderSettingInput = (setting: any, category: string) => {
    const settingKey = `${category}.${setting.setting_key}`;
    const currentValue = localSettings[settingKey] !== undefined 
      ? localSettings[settingKey] 
      : (typeof setting.setting_value === 'string' ? JSON.parse(setting.setting_value) : setting.setting_value);
    
    const hasUnsavedChanges = localSettings[settingKey] !== undefined;

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={currentValue}
              onCheckedChange={(value) => handleSystemSettingChange(category, setting.setting_key, value)}
            />
            <span className="text-sm">{currentValue ? 'Включено' : 'Отключено'}</span>
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handleSystemSettingChange(category, setting.setting_key, e.target.value)}
            placeholder={setting.description}
            rows={3}
          />
        );
      
      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => handleSystemSettingChange(category, setting.setting_key, e.target.value)}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={currentValue || ''}
              onChange={(e) => handleSystemSettingChange(category, setting.setting_key, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );
      
      default:
        return (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleSystemSettingChange(category, setting.setting_key, e.target.value)}
            placeholder={setting.description}
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Globe className="h-4 w-4" />;
      case 'seo': return <Search className="h-4 w-4" />;
      case 'appearance': return <Palette className="h-4 w-4" />;
      case 'contact': return <Phone className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'general': return 'Общие настройки';
      case 'seo': return 'SEO и метатеги';
      case 'appearance': return 'Внешний вид';
      case 'contact': return 'Контактная информация';
      case 'security': return 'Безопасность';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  if (systemLoading || siteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Универсальный редактор сайта</h1>
          <p className="text-muted-foreground">
            Редактируйте все настройки сайта в одном месте
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={createBackup.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Создать бэкап
          </Button>
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {previewMode ? 'Выйти из превью' : 'Режим превью'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск настроек..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">Системные настройки</TabsTrigger>
          <TabsTrigger value="site">Настройки сайта</TabsTrigger>
          <TabsTrigger value="backups">Бэкапы</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          {filteredSettings.map(([category, settings]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span>{getCategoryTitle(category)}</span>
                  <Badge variant="secondary">{settings.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Настройки категории {getCategoryTitle(category).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.map((setting) => {
                  const settingKey = `${category}.${setting.setting_key}`;
                  const hasUnsavedChanges = localSettings[settingKey] !== undefined;
                  
                  return (
                    <div key={setting.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="flex items-center space-x-2">
                            <span>{setting.display_name || setting.setting_key}</span>
                            {hasUnsavedChanges && (
                              <Badge variant="outline" className="text-xs">
                                Не сохранено
                              </Badge>
                            )}
                          </Label>
                          {setting.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {setting.description}
                            </p>
                          )}
                        </div>
                        {hasUnsavedChanges && (
                          <Button
                            size="sm"
                            onClick={() => handleSaveSystemSetting(category, setting.setting_key, setting)}
                            disabled={updateSystemSetting.isPending}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Сохранить
                          </Button>
                        )}
                      </div>
                      {renderSettingInput(setting, category)}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки сайта</CardTitle>
              <CardDescription>
                Настройки фотографа и контактной информации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Имя фотографа</Label>
                    <Input
                      value={siteSettings.photographer_name || ''}
                      onChange={(e) => {/* Implement site settings update */}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={siteSettings.contact_email || ''}
                      onChange={(e) => {/* Implement site settings update */}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input
                      value={siteSettings.contact_phone || ''}
                      onChange={(e) => {/* Implement site settings update */}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Адрес</Label>
                    <Input
                      value={siteSettings.contact_address || ''}
                      onChange={(e) => {/* Implement site settings update */}}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Описание фотографа</Label>
                    <Textarea
                      value={siteSettings.photographer_description || ''}
                      onChange={(e) => {/* Implement site settings update */}}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление бэкапами</CardTitle>
              <CardDescription>
                Создавайте и восстанавливайте резервные копии конфигурации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups?.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{backup.backup_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(backup.created_at).toLocaleString('ru-RU')}
                      </p>
                      {backup.description && (
                        <p className="text-sm text-muted-foreground">{backup.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Скачать
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Восстановить
                      </Button>
                    </div>
                  </div>
                ))}
                {!backups?.length && (
                  <p className="text-center text-muted-foreground py-8">
                    Нет сохраненных бэкапов
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversalSiteEditor;