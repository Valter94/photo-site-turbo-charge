
import React, { useEffect } from 'react';
import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import LocationsSection from "../components/LocationsSection";
import PricingSection from "../components/PricingSection";
import BookingCalendar from "../components/BookingCalendar";
import PortfolioSection from "../components/PortfolioSection";
import ReviewsSection from "../components/ReviewsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

const Index = () => {
  useEffect(() => {
    // SEO оптимизация
    document.title = "Фотограф Ирина Москва - Свадебная и Портретная Фотосъемка | 5+ лет опыта";
    
    // Обновляем meta описание
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Профессиональный фотограф Ирина в Москве. Свадебная, портретная и семейная фотосъемка с опытом 5+ лет. ✨ 500+ довольных клиентов ✨ Качественные фото за 48 часов. Записаться на съемку!'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Профессиональный фотограф Ирина в Москве. Свадебная, портретная и семейная фотосъемка с опытом 5+ лет. ✨ 500+ довольных клиентов ✨ Качественные фото за 48 часов. Записаться на съемку!';
      document.head.appendChild(meta);
    }

    // Добавляем keywords
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'фотограф москва, свадебный фотограф, портретная съемка, семейная фотосъемка, love story, фотосессия москва, профессиональный фотограф, фотограф ирина';
    document.head.appendChild(metaKeywords);

    // Open Graph теги
    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = 'Фотограф Ирина - Профессиональная фотосъемка в Москве';
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = 'Свадебная, портретная и семейная фотосъемка с опытом 5+ лет. 500+ довольных клиентов. Качественные фото за 48 часов.';
    document.head.appendChild(ogDescription);

    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = 'https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=1200&h=630&fit=crop&auto=format';
    document.head.appendChild(ogImage);

    // Structured Data для поисковых систем
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Фотограф Ирина",
      "description": "Профессиональная свадебная, портретная и семейная фотосъемка в Москве",
      "image": "https://images.unsplash.com/photo-1494790108755-2616c6f24c34?w=400&h=400&fit=crop&auto=format",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "55.7558",
        "longitude": "37.6176"
      },
      "telephone": "+7 (999) 123-45-67",
      "email": "bagreshevafoto@gmail.com",
      "url": window.location.origin,
      "openingHours": "Mo-Su 09:00-21:00",
      "priceRange": "5000-50000 RUB",
      "serviceArea": {
        "@type": "Place",
        "name": "Москва и Московская область"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Услуги фотосъемки",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Свадебная фотосъемка",
              "description": "Полный день свадебной съемки"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Портретная фотосъемка",
              "description": "Индивидуальная портретная съемка"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Семейная фотосъемка",
              "description": "Семейные фотосессии"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Canonical URL
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.origin;
    document.head.appendChild(canonical);

    // Cleanup function
    return () => {
      // Удаляем добавленные элементы при размонтировании компонента
      const elementsToRemove = [metaKeywords, ogTitle, ogDescription, ogImage, script, canonical];
      elementsToRemove.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <PortfolioSection />
      <LocationsSection />
      <PricingSection />
      <BookingCalendar />
      <ReviewsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
