
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MapPin, DollarSign, Users, BarChart3, Settings, Sparkles } from 'lucide-react';
import PortfolioImageManager from './PortfolioImageManager';
import LocationsManager from './LocationsManager';
import PricingManager from './PricingManager';
import ReviewsManager from './ReviewsManager';
import SiteAnalyticsDashboard from './SiteAnalyticsDashboard';
import EnhancedAdminPanel from './EnhancedAdminPanel';
import PhotoRetouchManager from './PhotoRetouchManager';

interface AllSectionsManagerProps {
  onLogout?: () => void;
}

const AllSectionsManager = ({ onLogout }: AllSectionsManagerProps) => {
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Панель управления сайтом
          </h1>
          <p className="text-gray-600">
            Управляйте всем контентом вашего сайта из одного места
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="portfolio" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Camera className="w-4 h-4" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger 
              value="retouch"
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4" />
              Ретушь
            </TabsTrigger>
            <TabsTrigger 
              value="locations"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <MapPin className="w-4 h-4" />
              Локации
            </TabsTrigger>
            <TabsTrigger 
              value="pricing"
              className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              <DollarSign className="w-4 h-4" />
              Цены
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="flex items-center gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              Отзывы
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gray-500 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioImageManager />
          </TabsContent>

          <TabsContent value="retouch" className="space-y-6">
            <PhotoRetouchManager />
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <LocationsManager />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <PricingManager />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SiteAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {onLogout ? (
              <EnhancedAdminPanel onLogout={onLogout} />
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">Настройки доступны только через главную админ-панель</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AllSectionsManager;
