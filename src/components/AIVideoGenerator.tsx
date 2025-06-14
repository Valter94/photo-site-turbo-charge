
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Video, Sparkles, Download, Play } from "lucide-react";

const AIVideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('romantic');
  const [duration, setDuration] = useState('short');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const { toast } = useToast();

  const videoStyles = [
    { value: 'romantic', label: '💕 Романтический', description: 'Нежные переходы, теплые тона' },
    { value: 'cinematic', label: '🎬 Кинематографический', description: 'Драматические кадры, глубокие цвета' },
    { value: 'dreamy', label: '✨ Мечтательный', description: 'Мягкие фокусы, пастельные оттенки' },
    { value: 'vintage', label: '📸 Винтажный', description: 'Ретро фильтры, классические тона' }
  ];

  const durations = [
    { value: 'short', label: '15 секунд', description: 'Короткий ролик для соцсетей' },
    { value: 'medium', label: '30 секунд', description: 'Средняя длительность' },
    { value: 'long', label: '60 секунд', description: 'Полноценное видео' }
  ];

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, опишите желаемое видео",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Здесь будет реальная интеграция с AI видео сервисом
      // Пока имитируем генерацию
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Имитация сгенерированного видео
      setGeneratedVideo("https://example.com/generated-video.mp4");
      
      toast({
        title: "Видео готово! 🎉",
        description: "Ваше AI-видео успешно создано"
      });
    } catch (error) {
      toast({
        title: "Ошибка генерации",
        description: "Не удалось создать видео. Попробуйте еще раз",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedPrompts = [
    "Свадебная церемония в розовых тонах с лепестками роз и мягким светом",
    "Love story пары в парке осенью с золотистыми листьями",
    "Семейная фотосессия на берегу озера на закате",
    "Романтическая прогулка по старым улочкам Москвы",
    "Нежная фотосессия беременности в студии с цветами"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-pink-200 shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Video className="w-8 h-8 text-pink-600" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Создание AI Видео
            </CardTitle>
          </div>
          <p className="text-gray-600">
            Опишите ваше видение, и ИИ создаст уникальное видео для вашего портфолио
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание видео *
            </label>
            <Textarea
              placeholder="Опишите желаемое видео: сцена, настроение, цвета, движения..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>

          {/* Suggested Prompts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Готовые идеи:
            </label>
            <div className="grid gap-2">
              {suggestedPrompts.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className="text-left p-3 rounded-lg border border-pink-100 hover:border-pink-300 hover:bg-pink-50 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Стиль видео
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {videoStyles.map((styleOption) => (
                <button
                  key={styleOption.value}
                  onClick={() => setStyle(styleOption.value)}
                  className={`p-4 rounded-lg border transition-all ${
                    style === styleOption.value
                      ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="font-medium text-left">{styleOption.label}</div>
                  <div className="text-sm text-gray-500 text-left">{styleOption.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Длительность
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {durations.map((durationOption) => (
                <button
                  key={durationOption.value}
                  onClick={() => setDuration(durationOption.value)}
                  className={`p-4 rounded-lg border transition-all ${
                    duration === durationOption.value
                      ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="font-medium">{durationOption.label}</div>
                  <div className="text-sm text-gray-500">{durationOption.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 rounded-xl text-lg font-semibold"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Создание видео...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Создать AI Видео
              </>
            )}
          </Button>

          {/* Generated Video Preview */}
          {generatedVideo && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-800">Видео готово!</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-green-300">
                      <Play className="w-4 h-4 mr-1" />
                      Просмотр
                    </Button>
                    <Button size="sm" variant="outline" className="border-green-300">
                      <Download className="w-4 h-4 mr-1" />
                      Скачать
                    </Button>
                  </div>
                </div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Советы для лучшего результата:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Детально опишите сцену, освещение и настроение</li>
              <li>• Укажите ключевые элементы: цветы, локации, эмоции</li>
              <li>• Используйте слова: "мягкий свет", "золотой час", "романтично"</li>
              <li>• Генерация может занять 2-5 минут</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVideoGenerator;
