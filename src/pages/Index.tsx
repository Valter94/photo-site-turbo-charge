
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import LocationsSection from "@/components/LocationsSection";
import PricingSection from "@/components/PricingSection";
import ReviewsSection from "@/components/ReviewsSection";
import BookingForm from "@/components/BookingForm";
import EnhancedBookingCalendar from "@/components/EnhancedBookingCalendar";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LiveStats from "@/components/LiveStats";
import FloatingReviews from "@/components/FloatingReviews";
import SEOHead from "@/components/SEOHead";
import Analytics from "@/components/Analytics";
import { HelmetProvider } from 'react-helmet-async';

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
          <LiveStats />
          <PortfolioSection />
          <LocationsSection />
          <PricingSection />
          <ReviewsSection />
          <div id="booking">
            <EnhancedBookingCalendar />
          </div>
          <FAQSection />
        </main>
        <Footer />
        <ScrollToTop />
        <FloatingReviews />
      </div>
    </HelmetProvider>
  );
};

export default Index;
