
import React from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, Image as ImageIcon } from "lucide-react";

interface Props {
  currentImage: string | undefined;
  onRemoveImage?: () => void;
}

export function ImageUploadPreview({ currentImage, onRemoveImage }: Props) {
  if (!currentImage)
    return (
      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
    );

  return (
    <div className="relative group mt-4">
      <img
        src={currentImage}
        alt="Загруженное изображение"
        className="w-full h-48 object-cover rounded-lg border border-gray-200"
        onError={e => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop&auto=format&q=50";
        }}
      />
      {onRemoveImage && (
        <Button
          onClick={onRemoveImage}
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <span className="text-white text-sm font-medium">Нажмите X чтобы удалить</span>
      </div>
    </div>
  );
}
