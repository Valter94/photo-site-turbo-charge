
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StoryCarousel from "@/components/StoryCarousel";
import ServicesVideoPresentation from "@/components/ServicesVideoPresentation";
import AIVideoGenerator from "@/components/AIVideoGenerator";
import PortfolioSection from "@/components/PortfolioSection";
import LocationsSection from "@/components/LocationsSection";
import PricingSection from "@/components/PricingSection";
import ReviewsSection from "@/components/ReviewsSection";
import BookingForm from "@/components/BookingForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <StoryCarousel />
        <ServicesVideoPresentation />
        <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎬 Создание AI Видео
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Современные технологии искусственного интеллекта помогают создавать уникальные видео для вашего портфолио
              </p>
            </div>
            <AIVideoGenerator />
          </div>
        </section>
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
    </div>
  );
};

export default Index;
