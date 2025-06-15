
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateName = (name: string) => name.length >= 2 && name.length <= 40;
const validateComment = (comment: string) => comment.length >= 10 && comment.length <= 600;

interface ReviewFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}
const ReviewForm: React.FC<ReviewFormProps> = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    comment: "",
    service_type: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};
    if (!validateName(formData.name)) errs.name = "Имя должно быть от 2 до 40 символов";
    if (!validateEmail(formData.email)) errs.email = "Введите корректный email";
    if (!formData.rating) errs.rating = "Пожалуйста, выберите оценку";
    if (!formData.comment || !validateComment(formData.comment)) errs.comment = "Комментарий должен быть от 10 до 600 символов";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({
        title: "Проверьте форму",
        description: Object.values(errs).join(". "),
        variant: "destructive"
      });
      return;
    }
    // Имитация отправки (на email, смело заменять на insert в базу если потребуется)
    window.location.href = `mailto:bagreshevafoto@gmail.com?subject=Новый отзыв с сайта фотографа&body=${encodeURIComponent(
      `Имя: ${formData.name}\nEmail: ${formData.email}\nОценка: ${formData.rating}\nТип: ${formData.service_type}\n\nКомментарий:\n${formData.comment}`
    )}`;
    setFormData({ name: "", email: "", rating: "", comment: "", service_type: "" });
    setErrors({});
    onSuccess();
    toast({ title: "Спасибо!", description: "Ваш отзыв отправлен!" });
  };
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <h3 className="text-xl font-bold mb-4">Поделитесь своим впечатлением</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Ваше имя"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            aria-invalid={!!errors.name}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            aria-invalid={!!errors.email}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={formData.rating}
            onValueChange={v => setFormData({ ...formData, rating: v })}
          >
            <SelectTrigger aria-invalid={!!errors.rating}>
              <SelectValue placeholder="Оценка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5 звезд)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ (4 звезды)</SelectItem>
              <SelectItem value="3">⭐⭐⭐ (3 звезды)</SelectItem>
              <SelectItem value="2">⭐⭐ (2 звезды)</SelectItem>
              <SelectItem value="1">⭐ (1 звезда)</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={formData.service_type}
            onValueChange={v => setFormData({ ...formData, service_type: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Тип съемки" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wedding">Свадебная съемка</SelectItem>
              <SelectItem value="portrait">Портретная съемка</SelectItem>
              <SelectItem value="family">Семейная съемка</SelectItem>
              <SelectItem value="lovestory">Love Story</SelectItem>
              <SelectItem value="corporate">Корпоративная съемка</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Расскажите о своих впечатлениях..."
          value={formData.comment}
          onChange={e => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
          required
          aria-invalid={!!errors.comment}
        />
        <div className="flex gap-4">
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
            Отправить отзыв
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
        </div>
      </form>
    </div>
  );
};
export default ReviewForm;
