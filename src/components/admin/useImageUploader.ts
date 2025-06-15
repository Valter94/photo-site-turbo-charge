
import { useState } from "react";
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { useImageDescriptionAI } from '@/hooks/useImageDescriptionAI';

export function useImageUploader({
  onImageUploaded,
  folder,
  onImageDescribed,
  fileInputRef,
  currentImage,
  urlInput,
  setUrlInput,
  setDescStatus
}: any) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDescription, setAIDescription] = useState<string | null>(null);
  const { uploadFile } = useFileUpload();
  const { toast } = useToast();
  const { generateDescription, loading: aiLoading, error: aiError } = useImageDescriptionAI();

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file, folder);
      onImageUploaded(url);
      setError(null);
      if (fileInputRef?.current) fileInputRef.current.value = '';
      toast({ title: "Успешно!", description: "Изображение успешно загружено" });
    } catch (error: any) {
      setError(error?.message || "Не удалось загрузить файл");
      toast({
        title: "Ошибка загрузки",
        description: error?.message || "Не удалось загрузить файл",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    setError(null);
    if (!urlInput.trim()) {
      setError("Введите URL изображения");
      toast({ title: "Ошибка", description: "Введите URL изображения", variant: "destructive" });
      return;
    }
    try {
      const url = new URL(urlInput.trim());
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const hasImageExtension = imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
      if (!hasImageExtension && !url.hostname.includes('unsplash') && !url.hostname.includes('supabase')) {
        throw new Error('URL не ведет к изображению');
      }
      onImageUploaded(urlInput.trim());
      setUrlInput('');
      toast({ title: "Успешно!", description: "Изображение добавлено по URL" });
    } catch (err) {
      setError("Введите корректный URL изображения");
      toast({ title: "Ошибка", description: "Введите корректный URL изображения", variant: "destructive" });
    }
  };

  const handleAIDescribe = async () => {
    if (!currentImage) return;
    setDescStatus && setDescStatus("generating");
    setAIDescription(null);
    const desc = await generateDescription(currentImage);
    if (desc) {
      setAIDescription(desc);
      setDescStatus && setDescStatus("success");
      if (onImageDescribed) onImageDescribed(desc);
      toast({
        title: "AI Описание готово",
        description: "Вы можете использовать его или изменить вручную",
        variant: "default"
      });
    } else {
      setDescStatus && setDescStatus("fail");
      setAIDescription(null);
      toast({
        title: "Ошибка AI описания",
        description: aiError || "Не удалось сгенерировать описание",
        variant: "destructive"
      });
    }
  };

  return {
    uploading,
    error,
    aiDescription,
    aiLoading,
    aiError,
    handleFileUpload,
    handleUrlSubmit,
    handleAIDescribe,
    setError,
  };
}
