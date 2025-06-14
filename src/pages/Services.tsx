
import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ServicesVideoPresentation from "@/components/ServicesVideoPresentation";

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-20">
        <div className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Наши услуги
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Профессиональная фотография для всех важных моментов вашей жизни
              </p>
            </div>
            <ServicesVideoPresentation />
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Services;
