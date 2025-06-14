
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteAnalytics } from '@/hooks/useSiteAnalytics';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Users, 
  MousePointer, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

const SiteAnalyticsDashboard = () => {
  const { analytics, recommendations, isLoading, updateAnalytics } = useSiteAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'seo': return <Activity className="h-4 w-4" />;
      case 'usability': return <Users className="h-4 w-4" />;
      case 'content': return <Lightbulb className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Загрузка аналитики...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Аналитика сайта</h1>
          <p className="text-gray-600">Мониторинг производительности и активности пользователей</p>
        </div>
        <Button onClick={updateAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить данные
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="errors">Ошибки</TabsTrigger>
          <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
          <TabsTrigger value="detailed">Детализация</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Основные метрики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Просмотры страниц</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pageViews}</div>
                <p className="text-xs text-muted-foreground">За все время</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Уникальные посетители</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.uniqueVisitors}</div>
                <p className="text-xs text-muted-foreground">Уникальные сессии</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Показатель отказов</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.bounceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.bounceRate > 70 ? 'Высокий' : analytics.bounceRate > 50 ? 'Средний' : 'Низкий'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Время на сайте</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(analytics.avgSessionDuration / 60)}м {analytics.avgSessionDuration % 60}с
                </div>
                <p className="text-xs text-muted-foreground">Среднее время сессии</p>
              </CardContent>
            </Card>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Популярные страницы</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="path" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Типы устройств</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Ошибки сайта ({analytics.errors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.errors.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Ошибок не обнаружено!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.errors.map((error, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-red-600">{error.message}</h4>
                        <Badge variant="destructive">{error.count} раз</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Последний раз: {error.lastOccurred.toLocaleString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Рекомендации по улучшению ({recommendations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Все рекомендации выполнены!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(rec.type)}
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge 
                            className={`${getPriorityColor(rec.priority)} text-white`}
                          >
                            {rec.priority === 'high' ? 'Высокий' : 
                             rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      <p className="text-sm font-medium text-blue-600">{rec.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Устройства посетителей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.deviceTypes.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.type)}
                        <span className="capitalize">{device.type}</span>
                      </div>
                      <Badge variant="secondary">{device.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика производительности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Время загрузки страницы</span>
                    <Badge variant="secondary">~2.3с</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Размер страницы</span>
                    <Badge variant="secondary">~1.2MB</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Запросов к серверу</span>
                    <Badge variant="secondary">15</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Web Vitals</span>
                    <Badge className="bg-green-500 text-white">Хорошо</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteAnalyticsDashboard;
