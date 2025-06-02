
import React, { useState } from 'react';
import { Settings, MapPin, Camera, Calendar, DollarSign, Users, MessageSquare, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-gray-600">Управление сайтом фотографа</p>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Выйти</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Локации
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Бронирования
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Цены
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Отзывы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Новые заявки</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">за последнюю неделю</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные локации</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10</div>
                  <p className="text-xs text-muted-foreground">по сезонам</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Фотографии</CardTitle>
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">в портфолио</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.9</div>
                  <p className="text-xs text-muted-foreground">из 5 звезд</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление локациями</h2>
              <Button>Добавить локацию</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Локации по сезонам</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Весенние', 'Летние', 'Осенние', 'Зимние'].map((season) => (
                      <Card key={season} className="p-4">
                        <h4 className="font-medium">{season}</h4>
                        <p className="text-sm text-gray-600">2 локации</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление портфолио</h2>
              <Button>Загрузить фото</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Здесь будет галерея с инструментами для загрузки и обработки изображений</p>
                <div className="mt-4 text-sm text-blue-600">
                  💡 Требуется подключение Supabase для хранения изображений
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Календарь бронирований</h2>
              <Button>Добавить время</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Здесь будет календарь с доступными слотами времени</p>
                <div className="mt-4 text-sm text-blue-600">
                  💡 Требуется подключение Supabase для управления бронированиями
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление ценами</h2>
              <Button>Добавить тариф</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Текущие тарифы</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Свадебная съемка', 'Love Story', 'Портретная съемка'].map((service) => (
                      <Card key={service} className="p-4">
                        <h4 className="font-medium">{service}</h4>
                        <p className="text-sm text-gray-600">3 плана</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление отзывами</h2>
              <Button>Модерировать</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Здесь будет система управления отзывами и рейтингами</p>
                <div className="mt-4 text-sm text-blue-600">
                  💡 Требуется подключение Supabase для хранения отзывов
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
