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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

  const lineChartData = {
    labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль'],
    datasets: [
      {
        label: 'Посещения сайта',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Свадьбы', 'Портреты', 'Love Story'],
    datasets: [
      {
        label: 'Распределение заказов',
        data: [30, 40, 30],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

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
                  <Line data={lineChartData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение заказов</CardTitle>
                </CardHeader>
                <CardContent>
                  <Pie data={pieChartData} />
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
