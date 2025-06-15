
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Props {
  uploading: boolean;
  onUpload: (file: File) => void;
}

export function ImageUploadFilePicker({ uploading, onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    setDragActive(active);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          dragActive
            ? "border-purple-400 bg-purple-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={e => handleDrag(e, true)}
        onDragLeave={e => handleDrag(e, false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {dragActive ? "Отпустите файл здесь" : "Перетащите файл сюда или нажмите для выбора"}
          </p>
        </div>
      </div>
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full mt-2"
        variant="outline"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Загрузка..." : "Выбрать файл с компьютера"}
      </Button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Поддерживаемые форматы: JPG, PNG, WebP, GIF (до 10MB)
      </p>
    </div>
  );
}
