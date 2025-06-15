
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Props {
  onGenerate: () => void;
  aiLoading: boolean;
  descStatus: "idle" | "generating" | "success" | "fail";
  aiDescription: string | null;
}

export function ImageUploadAIDesc({ onGenerate, aiLoading, descStatus, aiDescription }: Props) {
  return (
    <div className="mt-3 flex flex-col items-stretch gap-2">
      <Button
        type="button"
        onClick={onGenerate}
        className="w-full flex items-center justify-center gap-2"
        disabled={aiLoading || descStatus === "generating"}
        variant="outline"
      >
        <Sparkles className="w-4 h-4" />
        {descStatus === "generating" ? "Генерация описания..." : "Сгенерировать описание с помощью ИИ"}
      </Button>
      {aiDescription && (
        <div className="bg-gray-50 rounded p-2 mt-1 text-gray-700 text-sm border">
          <span className="font-semibold">AI: </span>
          {aiDescription}
        </div>
      )}
    </div>
  );
}
