
import HeroSection from "../components/HeroSection";
import LocationsSection from "../components/LocationsSection";
import PricingSection from "../components/PricingSection";
import BookingCalendar from "../components/BookingCalendar";
import PortfolioSection from "../components/PortfolioSection";
import ReviewsSection from "../components/ReviewsSection";
import FAQSection from "../components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PortfolioSection />
      <LocationsSection />
      <PricingSection />
      <BookingCalendar />
      <ReviewsSection />
      <FAQSection />
    </div>
  );
};

export default Index;
