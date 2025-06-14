import Hero from "@/components/Hero";
import PortfolioSection from "@/components/PortfolioSection";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import StoryCarousel from "@/components/StoryCarousel";
const Index = () => {
  return (
    <>
      <Hero />
      <StoryCarousel />
      <PortfolioSection />
      <Testimonials />
      <ContactForm />
    </>
  );
};
export default Index;
