
import { Suspense, lazy, useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/SEOHead";
import Analytics from "@/components/Analytics";
import ScrollToTop from "@/components/ScrollToTop";
import LiveSiteActivity from "@/components/LiveSiteActivity";
import PortfolioSection from "@/components/PortfolioSection";
import AchievementsBadges from "@/components/AchievementsBadges";
import LocationsSection from "@/components/LocationsSection";
import PricingSection from "@/components/PricingSection";
import AdditionalServicesSection from "@/components/AdditionalServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import EnhancedBookingCalendar from "@/components/EnhancedBookingCalendar";
import Footer from "@/components/Footer";
import FloatingReviews from "@/components/FloatingReviews";
import ErrorResolver from "@/components/ErrorResolver";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResponsiveContainer from "@/components/ResponsiveContainer";
import { HelmetProvider } from 'react-helmet-async';

import { usePricing } from '@/hooks/usePricing';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useReviews } from '@/hooks/useReviews';
import { useResponsive } from '@/hooks/useResponsive';

const SectionLoader = () => (
  <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
  </div>
);

const Index = () => {
  const { data: pricing, isLoading: pricingLoading } = usePricing();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    if (pricingLoading || !pricing || pricing.length === 0) return;
    
    const serviceNames = pricing.map(service => {
      const serviceTypes = {
        'wedding_preparations': 'утренние сборы',
        'wedding_ceremony': 'свадебную съемку',
        'wedding_full_day': 'полный свадебный день',
        'lovestory': 'Love Story съемку',
        'portrait': 'портретную фотосессию',
        'family': 'семейную фотосессию',
        'corporate': 'корпоративную съемку'
      };
      return serviceTypes[service.service_type as keyof typeof serviceTypes] || 'фотосессию';
    });

    const names = ['Анна', 'Михаил', 'Елена', 'Дмитрий', 'Ольга', 'Александр', 'Мария', 'Владимир', 'Наталья', 'Сергей'];
    
    const generateActivities = () => {
      const activities = [];
      
      if (portfolio && portfolio.length > 0) {
        const recentPhotos = portfolio.slice(-3);
        recentPhotos.forEach(photo => {
          activities.push(`Добавлена новая работа: ${photo.title}`);
        });
      }
      
      if (reviews && reviews.length > 0) {
        const approvedReviews = reviews.filter(r => r.is_approved).slice(-3);
        approvedReviews.forEach(review => {
          activities.push(`${review.name} оставил(а) отзыв ⭐⭐⭐⭐⭐`);
        });
      }
      
      serviceNames.slice(0, 2).forEach(serviceName => {
        names.slice(0, 2).forEach(name => {
          activities.push(`${name} забронировал(а) ${serviceName}`);
        });
      });
      
      return activities;
    };

    const activities = generateActivities();

    const addActivity = () => {
      if (activities.length === 0) return;
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [randomActivity, ...prev.slice(0, 2)]);
    };

    const timer = setInterval(addActivity, Math.random() * 20 * 60 * 1000 + 20 * 60 * 1000);
    setTimeout(addActivity, 5000);

    return () => clearInterval(timer);
  }, [pricing, portfolio, reviews, pricingLoading]);

  if (pricingLoading || portfolioLoading || reviewsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Загрузка сайта..." />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="flex min-h-screen flex-col">
        <SEOHead />
        <Analytics />
        <Navigation />
        
        <main className="flex-1">
          <ResponsiveContainer
            className="w-full"
            mobileClassName="px-2"
            desktopClassName="px-0"
          >
            <div id="hero">
              <HeroSection />
            </div>
            
            <LiveSiteActivity recentActivity={recentActivity} />
            
            <div id="portfolio" className="scroll-mt-20">
              <Suspense fallback={<SectionLoader />}>
                <PortfolioSection />
              </Suspense>
            </div>
            
            <AchievementsBadges />
            
            <div id="locations" className="scroll-mt-20">
              <Suspense fallback={<SectionLoader />}>
                <LocationsSection />
              </Suspense>
            </div>
            
            <div id="pricing" className="scroll-mt-20">
              <Suspense fallback={<SectionLoader />}>
                <PricingSection />
              </Suspense>
            </div>
            
            <Suspense fallback={<SectionLoader />}>
              <AdditionalServicesSection />
            </Suspense>
            
            <div id="reviews" className="scroll-mt-20">
              <Suspense fallback={<SectionLoader />}>
                <ReviewsSection />
              </Suspense>
            </div>
            
            <div id="booking" className="scroll-mt-20">
              <Suspense fallback={<SectionLoader />}>
                <EnhancedBookingCalendar />
              </Suspense>
            </div>
          </ResponsiveContainer>
        </main>

        <div id="contact" className="scroll-mt-20">
          <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
            <Footer />
          </Suspense>
        </div>
        
        <ScrollToTop />
        
        {!isMobile && (
          <Suspense fallback={null}>
            <FloatingReviews />
          </Suspense>
        )}
        
        <ErrorResolver />
      </div>
    </HelmetProvider>
  );
};

export default Index;
