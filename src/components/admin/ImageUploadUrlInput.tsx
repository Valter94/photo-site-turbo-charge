
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function ImageUploadUrlInput({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        onKeyPress={e => e.key === "Enter" && onSubmit()}
      />
      <Button onClick={onSubmit} disabled={!value.trim() || disabled} className="w-full">
        <Link className="h-4 w-4 mr-2" />
        Добавить по URL
      </Button>
    </div>
  );
}
