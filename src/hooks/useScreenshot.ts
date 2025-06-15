
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Хук для запроса скриншота с Supabase Edge Function
export const useScreenshot = () => {
  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const { data, error } = await supabase.functions.invoke("screenshot", {
        body: { imageUrl }
      });
      if (error) throw error;
      return data?.screenshotUrl;
    },
  });
}
