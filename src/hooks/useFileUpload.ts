
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, folder: string = '') => {
    try {
      setUploading(true);
      
      // Проверяем размер файла (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Файл слишком большой. Максимальный размер: 10MB');
      }

      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Неподдерживаемый формат файла. Разрешены: JPEG, PNG, WebP, GIF');
      }
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      console.log('Uploading file:', fileName, 'to path:', filePath);

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);

      toast({
        title: "Успешно",
        description: "Файл загружен успешно",
      });

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить файл",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (url: string) => {
    try {
      // Извлекаем путь файла из URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderIndex = urlParts.findIndex(part => part === 'images') + 1;
      const filePath = urlParts.slice(folderIndex).join('/');

      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Файл удален",
      });
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить файл",
        variant: "destructive"
      });
    }
  };

  return { uploadFile, deleteFile, uploading };
};
