
import { Suspense, lazy } from 'react';
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
const LiveStats = lazy(() => import("@/components/LiveStats"));
const FloatingReviews = lazy(() => import("@/components/FloatingReviews"));

// Компонент загрузки
const SectionLoader = () => (
  <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
  </div>
);

const Index = () => {
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
          
          <Suspense fallback={<SectionLoader />}>
            <LiveStats />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <PortfolioSection />
          </Suspense>
          
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
