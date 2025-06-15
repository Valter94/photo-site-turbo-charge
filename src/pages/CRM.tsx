
import React from 'react';
import Navigation from "@/components/Navigation";
import CRMDashboard from "@/components/CRMDashboard";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { HelmetProvider } from 'react-helmet-async';

const CRM = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="CRM - Управление клиентами | Фотограф Ирина"
          description="Система управления клиентами для фотографа. Отслеживание заявок, статусов бронирований и доходов."
        />
        <Navigation />
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">CRM - Управление клиентами</h1>
              <p className="text-gray-600 mt-2">
                Отслеживайте заявки, управляйте статусами бронирований и анализируйте доходы
              </p>
            </div>
            <CRMDashboard />
          </div>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default CRM;
