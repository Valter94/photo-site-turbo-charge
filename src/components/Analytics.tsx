
import React, { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    ym: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const Analytics = () => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    // Google Analytics
    const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Замените на ваш ID
    
    if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      // Загружаем Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_title: document.title,
          page_location: window.location.href
        });
      `;
      document.head.appendChild(script2);
    }

    // Яндекс.Метрика
    const YM_COUNTER_ID = 'XXXXXXXX'; // Замените на ваш ID
    
    if (YM_COUNTER_ID && YM_COUNTER_ID !== 'XXXXXXXX') {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        
        ym(${YM_COUNTER_ID}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
      `;
      document.head.appendChild(script);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <div><img src="https://mc.yandex.ru/watch/${YM_COUNTER_ID}" style="position:absolute; left:-9999px;" alt="" /></div>
      `;
      document.body.appendChild(noscript);
    }
  }, []);

  // Функции для отслеживания событий
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Яндекс.Метрика
    if (window.ym) {
      window.ym('XXXXXXXX', 'reachGoal', action, {
        category,
        label,
        value
      });
    }
  };

  // Отслеживание кликов по кнопкам
  useEffect(() => {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const buttonText = target.textContent || target.closest('button')?.textContent || 'Unknown';
        trackEvent('click', 'button', buttonText);
      }
      
      if (target.tagName === 'A' || target.closest('a')) {
        const link = (target as HTMLAnchorElement) || target.closest('a');
        if (link?.href) {
          trackEvent('click', 'link', link.href);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    if (window.ym) {
      window.ym('XXXXXXXX', 'reachGoal', action, {
        category,
        label,
        value
      });
    }
  };

  const trackBooking = (serviceType: string, price: number) => {
    trackEvent('booking_attempt', 'form', serviceType, price);
  };

  const trackPortfolioView = (category: string) => {
    trackEvent('portfolio_view', 'gallery', category);
  };

  const trackPhoneClick = () => {
    trackEvent('phone_click', 'contact');
  };

  return {
    trackEvent,
    trackBooking,
    trackPortfolioView,
    trackPhoneClick
  };
};

export default Analytics;
