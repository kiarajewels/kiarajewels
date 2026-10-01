'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

export const trackEvent = (eventName: string, params: any = {}) => {
  if (typeof window !== 'undefined') {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
    if ((window as any).fbq) {
      // Map GA4 events to standard FB events where possible
      let fbEvent = 'CustomEvent';
      if (eventName === 'view_item') fbEvent = 'ViewContent';
      if (eventName === 'add_to_cart') fbEvent = 'AddToCart';
      if (eventName === 'begin_checkout') fbEvent = 'InitiateCheckout';
      if (eventName === 'purchase') fbEvent = 'Purchase'; // Note: Usually we rely on webhook for this to avoid duplicates, but CAPI handles deduplication if eventID is passed
      if (eventName === 'search') fbEvent = 'Search';
      if (eventName === 'add_to_wishlist') fbEvent = 'AddToWishlist';
      
      if (fbEvent !== 'CustomEvent') {
        (window as any).fbq('track', fbEvent, params);
      } else {
        (window as any).fbq('trackCustom', eventName, params);
      }
    }
  }
};

import { Suspense } from 'react';

function AnalyticsContent() {
  const [consentGranted, setConsentGranted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check initial consent
    if (localStorage.getItem('cookie_consent') === 'granted') {
      setConsentGranted(true);
    }

    // Listen for consent change
    const handleConsent = () => setConsentGranted(true);
    window.addEventListener('cookie_consent_granted', handleConsent);

    return () => window.removeEventListener('cookie_consent_granted', handleConsent);
  }, []);

  useEffect(() => {
    if (consentGranted) {
      // Trigger pageview on route change
      if (pathname) {
        trackEvent('page_view', {
          page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
        });
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'PageView');
        }
      }
    }
  }, [pathname, searchParams, consentGranted]);

  if (!consentGranted) return null;

  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
