import { Suspense, lazy, useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/SEOHead";
import Analytics from "@/components/Analytics";
import ScrollToTop from "@/components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';

// Ленивая загрузка компонентов
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const LocationsSection = lazy(() => import("@/components/LocationsSection"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const AdditionalServicesSection = lazy(() => import("@/components/AdditionalServicesSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const EnhancedBookingCalendar = lazy(() => import("@/components/EnhancedBookingCalendar"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const FloatingReviews = lazy(() => import("@/components/FloatingReviews"));
import Gallery from "./Gallery";

// Импорт новых компонентов LiveSiteActivity и AchievementsBadges
import LiveStats from "@/components/LiveStats";
import LiveSiteActivity from "@/components/LiveSiteActivity";
import AchievementsBadges from "@/components/AchievementsBadges";

// Добавим логику получения recentActivity прямо здесь, чтобы передать в LiveSiteActivity
import { usePricing } from '@/hooks/usePricing';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useReviews } from '@/hooks/useReviews';

const SectionLoader = () => (
  <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
  </div>
);

const Index = () => {
  // Live activity logic (переносим из LiveStats)
  const { data: pricing } = usePricing();
  const { data: portfolio } = usePortfolio();
  const { data: reviews } = useReviews();
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    if (!pricing || pricing.length === 0) return;

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
      return serviceTypes[service.service_type] || 'фотосессию';
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
  }, [pricing, portfolio, reviews]);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white">
        <SEOHead />
        <Analytics />
        <Navigation />
        <main>
          <div id="hero">
            <HeroSection />
          </div>
          {/* ПЕРЕД ПОРТФОЛИО! */}
          <LiveSiteActivity recentActivity={recentActivity} />
          {/* Галерея и портфолио */}
          <div id="gallery">
            <Gallery />
          </div>
          <Suspense fallback={<SectionLoader />}>
            <PortfolioSection />
          </Suspense>
          {/* Блок достижений */}
          <AchievementsBadges />
          {/* После портфолио ... другие секции */}
          <Suspense fallback={<SectionLoader />}>
            <LocationsSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <PricingSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <AdditionalServicesSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <ReviewsSection />
          </Suspense>
          <div id="booking">
            <Suspense fallback={<SectionLoader />}>
              <EnhancedBookingCalendar />
            </Suspense>
          </div>
          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>
        </main>
        <Suspense fallback={<div className="h-32 bg-gray-100"></div>}>
          <Footer />
        </Suspense>
        <ScrollToTop />
        <Suspense fallback={null}>
          <FloatingReviews />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Index;
