
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Image, MapPin, DollarSign, Star, User } from 'lucide-react';
import PortfolioManager from './PortfolioManager';
import LocationsManager from '../admin/LocationsManager';
import PricingManager from '../admin/PricingManager';
import ReviewsManager from '../admin/ReviewsManager';
import SiteSettingsManager from '../admin/SiteSettingsManager';

interface EnhancedAdminPanelProps {
  onLogout: () => void;
}

const EnhancedAdminPanel = ({ onLogout }: EnhancedAdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <header className="bg-white shadow-lg border-b-2 border-rose-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                Панель управления
              </h1>
              <p className="text-gray-600 text-sm mt-1">Управление сайтом фотографа</p>
            </div>
            <Button 
              onClick={onLogout} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2 hover:bg-rose-50 border-rose-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm border border-rose-200 h-12">
            <TabsTrigger 
              value="portfolio" 
              className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 py-2"
            >
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Портфолио</span>
            </TabsTrigger>
            <TabsTrigger 
              value="locations"
              className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 py-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Локации</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pricing"
              className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 py-2"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Цены</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 py-2"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Отзывы</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 py-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="border-rose-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-rose-800">
                  <Image className="h-5 w-5" />
                  <span>Управление портфолио</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PortfolioManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card className="border-rose-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-rose-800">
                  <MapPin className="h-5 w-5" />
                  <span>Управление локациями</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LocationsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="border-rose-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-rose-800">
                  <DollarSign className="h-5 w-5" />
                  <span>Управление ценами</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PricingManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="border-rose-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-rose-800">
                  <Star className="h-5 w-5" />
                  <span>Управление отзывами</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ReviewsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-rose-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-rose-800">
                  <User className="h-5 w-5" />
                  <span>Настройки сайта</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SiteSettingsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedAdminPanel;
