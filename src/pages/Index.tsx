
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StoryCarousel from "@/components/StoryCarousel";
import PortfolioSection from "@/components/PortfolioSection";
import LocationsSection from "@/components/LocationsSection";
import PricingSection from "@/components/PricingSection";
import ReviewsSection from "@/components/ReviewsSection";
import BookingForm from "@/components/BookingForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LiveStats from "@/components/LiveStats";
import FloatingReviews from "@/components/FloatingReviews";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import InteractiveLocationMap from "@/components/InteractiveLocationMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <LiveStats />
        <StoryCarousel />
        <BeforeAfterGallery />
        <InteractiveLocationMap />
        <PortfolioSection />
        <LocationsSection />
        <PricingSection />
        <ReviewsSection />
        <div id="booking">
          <BookingForm />
        </div>
        <FAQSection />
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingReviews />
    </div>
  );
};

export default Index;
