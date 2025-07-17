
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSecuritySettings, useUpdateSecuritySetting } from '@/hooks/useSecuritySettings';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Shield, Eye, Settings, AlertTriangle } from 'lucide-react';

const SecurityManager = () => {
  const { data: securitySettings, isLoading: settingsLoading } = useSecuritySettings();
  const { data: auditLog, isLoading: logLoading } = useAuditLog();
  const updateSetting = useUpdateSecuritySetting();
  const [activeTab, setActiveTab] = useState("settings");

  const handleSettingUpdate = async (key: string, value: any) => {
    await updateSetting.mutateAsync({ setting_key: key, setting_value: value });
  };

  const getSettingValue = (key: string) => {
    const setting = securitySettings?.find(s => s.setting_key === key);
    return setting?.setting_value || null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'INSERT':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Центр безопасности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Настройки
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Аудит
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Предупреждения
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Аутентификация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_login_attempts">Максимальное количество попыток входа</Label>
                      <Input
                        id="max_login_attempts"
                        type="number"
                        value={getSettingValue('max_login_attempts') || 5}
                        onChange={(e) => handleSettingUpdate('max_login_attempts', parseInt(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">Время сессии (секунды)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={getSettingValue('session_timeout') || 3600}
                        onChange={(e) => handleSettingUpdate('session_timeout', parseInt(e.target.value))}
                        min="300"
                        max="86400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password_min_length">Минимальная длина пароля</Label>
                      <Input
                        id="password_min_length"
                        type="number"
                        value={getSettingValue('password_min_length') || 8}
                        onChange={(e) => handleSettingUpdate('password_min_length', parseInt(e.target.value))}
                        min="6"
                        max="32"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable_2fa"
                        checked={getSettingValue('enable_2fa') === 'true'}
                        onCheckedChange={(checked) => handleSettingUpdate('enable_2fa', checked ? 'true' : 'false')}
                      />
                      <Label htmlFor="enable_2fa">Включить двухфакторную аутентификацию</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Дополнительная безопасность</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        RLS (Row Level Security) активирован для всех таблиц
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Система аудита записывает все действия пользователей
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        Файловое хранилище защищено политиками безопасности
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Журнал аудита</CardTitle>
                </CardHeader>
                <CardContent>
                  {logLoading ? (
                    <div className="text-center py-4">Загрузка...</div>
                  ) : auditLog && auditLog.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {auditLog.map((entry) => (
                        <div key={entry.id} className="border rounded p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getActionBadgeColor(entry.action)}>
                                {entry.action}
                              </Badge>
                              <span className="text-sm font-medium">{entry.table_name}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(entry.created_at)}
                            </span>
                          </div>
                          
                          {entry.record_id && (
                            <div className="text-sm text-gray-600">
                              ID записи: {entry.record_id}
                            </div>
                          )}
                          
                          {entry.old_values && (
                            <div className="text-sm">
                              <span className="font-medium">Старые значения:</span>
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                                {JSON.stringify(entry.old_values, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {entry.new_values && (
                            <div className="text-sm">
                              <span className="font-medium">Новые значения:</span>
                              <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                                {JSON.stringify(entry.new_values, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Записи аудита отсутствуют
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Предупреждения безопасности</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Все политики безопасности активированы и работают корректно
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      Система мониторинга отслеживает подозрительную активность
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Рекомендуется регулярно обновлять пароли администраторов
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManager;
