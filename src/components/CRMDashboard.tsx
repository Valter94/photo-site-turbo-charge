
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, TrendingUp, Phone, Mail, MessageSquare, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  status: string;
  date: string;
  total_price: number;
  created_at: string;
  message?: string;
}

const CRMDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Загрузка клиентов
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные клиентов",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  // Фильтрация клиентов
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(client => client.service_type === serviceFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter, serviceFilter]);

  // Обновление статуса клиента
  const updateClientStatus = async (clientId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', clientId);

      if (error) throw error;

      setClients(prev => prev.map(client =>
        client.id === clientId ? { ...client, status: newStatus } : client
      ));

      toast({
        title: "Успешно",
        description: "Статус клиента обновлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  // Статистика
  const stats = {
    total: clients.length,
    pending: clients.filter(c => c.status === 'pending').length,
    confirmed: clients.filter(c => c.status === 'confirmed').length,
    completed: clients.filter(c => c.status === 'completed').length,
    totalRevenue: clients
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (c.total_price || 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтверждено';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-600">Всего клиентов</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-gray-600">Ожидают</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
              <p className="text-sm text-gray-600">Подтверждено</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-gray-600">Завершено</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('ru-RU')} ₽</p>
              <p className="text-sm text-gray-600">Доход</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Фильтры и поиск</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по имени, email или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидают</SelectItem>
                <SelectItem value="confirmed">Подтверждено</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Фильтр по услуге" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все услуги</SelectItem>
                <SelectItem value="wedding_full_day">Свадебная съемка</SelectItem>
                <SelectItem value="lovestory">Love Story</SelectItem>
                <SelectItem value="portrait">Портретная съемка</SelectItem>
                <SelectItem value="family">Семейная фотосессия</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Список клиентов */}
      <Card>
        <CardHeader>
          <CardTitle>Клиенты ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {getStatusText(client.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(client.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="font-semibold text-green-600">
                        {client.total_price?.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Услуга: </span>
                      <span className="text-sm font-medium">{client.service_type}</span>
                    </div>
                    
                    {client.message && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        {client.message}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Select
                      value={client.status}
                      onValueChange={(value) => updateClientStatus(client.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="confirmed">Подтверждено</SelectItem>
                        <SelectItem value="completed">Завершено</SelectItem>
                        <SelectItem value="cancelled">Отменено</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${client.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${client.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Клиенты не найдены
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;
