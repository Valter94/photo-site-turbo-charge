import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  Send, 
  User, 
  Brain, 
  TrendingUp, 
  Settings, 
  Eye,
  CheckCircle,
  AlertCircle,
  Zap,
  MessageSquare,
  BarChart3,
  Image,
  Star,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  commandResult?: any;
  suggestions?: string[];
}

const AIAdminBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: '🤖 AI Admin Bot активирован! Я помогу вам управлять сайтом без ограничений. Спрашивайте что угодно!',
      timestamp: new Date(),
      suggestions: [
        'Показать аналитику сайта',
        'Проверить ожидающие отзывы', 
        'Добавить новое фото в портфолио',
        'Оптимизировать SEO',
        'Обновить цены'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    portfolio: 0,
    reviews: 0,
    bookings: 0,
    pendingReviews: 0
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    loadStats();
  }, [messages]);

  const loadStats = async () => {
    try {
      const [portfolioRes, reviewsRes, bookingsRes] = await Promise.all([
        supabase.from('portfolio').select('*', { count: 'exact' }),
        supabase.from('reviews').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*', { count: 'exact' })
      ]);

      setStats({
        portfolio: portfolioRes.count || 0,
        reviews: reviewsRes.count || 0,
        bookings: bookingsRes.count || 0,
        pendingReviews: reviewsRes.data?.filter(r => !r.is_approved).length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-admin-chat', {
        body: { message: inputValue }
      });

      if (error) throw error;

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        commandResult: data.commandResult,
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (data.commandResult?.success) {
        toast({
          title: "Команда выполнена",
          description: data.commandResult.message
        });
        loadStats(); // Обновляем статистику
      }

    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '❌ Произошла ошибка. Проверьте настройки OpenAI API.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuickCommand = async (command: string, data?: any) => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-admin-chat', {
        body: { command, data }
      });

      if (error) throw error;

      const commandMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: `⚡ Выполнена команда: ${command}`,
        timestamp: new Date(),
        commandResult: result
      };

      setMessages(prev => [...prev, commandMessage]);
      
      if (result?.success) {
        toast({
          title: "Команда выполнена",
          description: result.message
        });
        loadStats();
      }

    } catch (error) {
      console.error('Error executing command:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить команду",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickSuggestions = [
    { text: 'Показать аналитику', command: 'GET_ANALYTICS', icon: BarChart3 },
    { text: 'Проверить отзывы', command: 'GET_PENDING_REVIEWS', icon: MessageSquare },
    { text: 'Статистика портфолио', command: 'GET_PORTFOLIO_STATS', icon: Image },
    { text: 'SEO рекомендации', command: 'SEO_OPTIMIZE', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Портфолио</p>
                <p className="text-2xl font-bold">{stats.portfolio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Отзывы</p>
                <p className="text-2xl font-bold">{stats.reviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Брони</p>
                <p className="text-2xl font-bold">{stats.bookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">На модерации</p>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Основной чат */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-6 w-6 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            AI Admin Assistant
            <Badge variant="secondary" className="ml-auto">
              <Brain className="h-3 w-3 mr-1" />
              GPT-4
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4">
          {/* Быстрые команды */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickSuggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => executeQuickCommand(suggestion.command)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {suggestion.text}
                </Button>
              );
            })}
          </div>

          <Separator className="mb-4" />

          {/* Сообщения */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white ml-4' 
                      : message.type === 'system'
                      ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                      : 'bg-gray-100 text-gray-900 mr-4'
                  }`}>
                    <div className="flex items-start gap-2">
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      ) : message.type === 'system' ? (
                        <Zap className="h-4 w-4 mt-1 flex-shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Результат команды */}
                        {message.commandResult && (
                          <div className="mt-2 p-2 bg-white/50 rounded border">
                            <div className="flex items-center gap-1 mb-1">
                              {message.commandResult.success ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              )}
                              <span className="text-xs font-medium">
                                {message.commandResult.message}
                              </span>
                            </div>
                            {message.commandResult.data && (
                              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(message.commandResult.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}

                        {/* Предложения */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Lightbulb className="h-2 w-2 mr-1" />
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Ввод сообщения */}
          <div className="flex gap-2 mt-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Спросите что угодно о сайте..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAdminBot;