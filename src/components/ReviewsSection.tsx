
import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const ReviewsSection = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <section id="reviews" className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
          <p className="text-xl text-gray-600 mb-8">
            Что говорят о моей работе довольные клиенты
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Оставить отзыв
          </Button>
        </div>
        {showForm && (
          <ReviewForm onCancel={() => setShowForm(false)} onSuccess={() => setShowForm(false)} />
        )}
        <ReviewsList />
      </div>
      <Button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-50 bg-pink-600 hover:bg-pink-700 text-white block md:hidden rounded-full shadow-lg px-4 py-3"
        style={{ minWidth: 56, minHeight: 56 }}
        aria-label="Оставить отзыв"
      >
        <Mail className="w-5 h-5" />
      </Button>
    </section>
  );
};
export default ReviewsSection;
