
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Фотограф Ирина - Свадебная и портретная фотосъемка в Москве",
  description = "Профессиональная свадебная, портретная и романтическая фотосъемка в Москве. Love Story, семейные фотосессии. Бронирование онлайн. ✨ Более 500 счастливых пар",
  keywords = "фотограф Москва, свадебная фотосъемка, портретная фотография, Love Story, фотосессия Москва, свадебный фотограф, семейная фотосъемка",
  image = "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=630&fit=crop",
  url = "https://irina-photographer.ru/",
  type = "website"
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${url}#business`,
        "name": "Фотограф Ирина",
        "description": description,
        "image": image,
        "telephone": "+7-926-256-35-50",
        "email": "bagreshevafoto@gmail.com",
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
        "url": url,
        "sameAs": [
          "https://instagram.com/irina_photographer",
          "https://wa.me/+79262563550"
        ],
        "priceRange": "8000-100000 RUB",
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "55.7558",
            "longitude": "37.6176"
          },
          "geoRadius": "50000"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        "url": url,
        "name": "Фотограф Ирина",
        "description": description,
        "publisher": {
          "@id": `${url}#business`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": `${url}?s={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Person",
        "@id": `${url}#photographer`,
        "name": "Ирина",
        "jobTitle": "Фотограф",
        "worksFor": {
          "@id": `${url}#business`
        },
        "url": url,
        "image": image,
        "sameAs": [
          "https://instagram.com/irina_photographer"
        ]
      }
    ]
  };

  return (
    <Helmet>
      {/* Базовые мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ирина" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Фотограф Ирина" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Дополнительные мета-теги */}
      <meta name="theme-color" content="#fb7185" />
      <meta name="msapplication-TileColor" content="#fb7185" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />

      {/* Структурированные данные */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Preconnect для производительности */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//mc.yandex.ru" />
    </Helmet>
  );
};

export default SEOHead;
