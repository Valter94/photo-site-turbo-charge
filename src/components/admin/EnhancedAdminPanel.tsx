
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Download,
  Plus,
  LogOut,
  Sparkles,
  Image
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import PortfolioImageManager from './PortfolioImageManager';
import LocationsManager from './LocationsManager';
import PricingManager from './PricingManager';
import ReviewsManager from './ReviewsManager';
import SiteSettingsManager from './SiteSettingsManager';
import SiteAnalyticsDashboard from './SiteAnalyticsDashboard';
import ExportManager from './ExportManager';
import AllSectionsManager from './AllSectionsManager';
import PhotoRetouchManager from './PhotoRetouchManager';

interface EnhancedAdminPanelProps {
  onLogout: () => void;
}

const EnhancedAdminPanel = ({ onLogout }: EnhancedAdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: "Посещения сегодня", value: "450" },
    { label: "Новые клиенты", value: "32" },
    { label: "Средний чек", value: "3,500 ₽" },
    { label: "Заказы на этой неделе", value: "120" },
  ];

  const lineChartData = [
    { name: 'Янв', visits: 65 },
    { name: 'Фев', visits: 59 },
    { name: 'Март', visits: 80 },
    { name: 'Апр', visits: 81 },
    { name: 'Май', visits: 56 },
    { name: 'Июнь', visits: 55 },
    { name: 'Июль', visits: 40 },
  ];

  const pieChartData = [
    { name: 'Свадьбы', value: 30, color: '#ff6384' },
    { name: 'Портреты', value: 40, color: '#36a2eb' },
    { name: 'Love Story', value: 30, color: '#ffce56' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Онлайн
            </Badge>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-8 w-full max-w-4xl mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="retouch" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Ретушь
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Локации
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Цены
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Отзывы
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Экспорт
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Посещения сайта</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#ff6384" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение заказов</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioImageManager />
          </TabsContent>

          <TabsContent value="retouch">
            <PhotoRetouchManager />
          </TabsContent>

          <TabsContent value="locations">
            <LocationsManager />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingManager />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManager />
          </TabsContent>

          <TabsContent value="settings">
            <AllSectionsManager />
          </TabsContent>

          <TabsContent value="export">
            <ExportManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAdminPanel;
