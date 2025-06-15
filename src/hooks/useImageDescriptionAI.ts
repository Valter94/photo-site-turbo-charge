
import { useState } from "react";

export function useImageDescriptionAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // url — публичная ссылка на картинку
  const generateDescription = async (url: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Используем Supabase функцию для обращения к OpenAI API
      const response = await fetch("/api/generate-image-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Ошибка генерации описания");
      }
      const data = await response.json();
      return data.description || null;
    } catch (err: any) {
      setError(err.message || "Произошла ошибка");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateDescription, loading, error };
}
