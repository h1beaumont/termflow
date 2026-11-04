import { useEffect } from "react";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Optimised Google Analytics 4 Component
 * 
 * Features:
 * - Lazy-loads GA script (deferred until scroll or 2.5s timeout)
 * - Minimal performance impact
 * - GDPR-compliant default consent
 * - Only loads in production
 * 
 * Performance Strategy:
 * - Script loads on first scroll interaction
 * - Fallback timeout of 2.5 seconds if no scroll
 * - Reduces initial page load time
 */
export function GoogleAnalytics({ measurementId = "G-XXXXXXXXXX" }: GoogleAnalyticsProps) {
  // Only load GA in production or if measurement ID is configured
  const isConfigured = measurementId && measurementId !== "G-XXXXXXXXXX";
  const isProd = import.meta.env.PROD;
  const shouldLoad = isProd && isConfigured;

  useEffect(() => {
    if (!shouldLoad) return;

    let gaLoaded = false;

    const loadGA = () => {
      if (gaLoaded) return;
      gaLoaded = true;

      // Create and inject GA script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }

      // Default consent to denied (GDPR)
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });

      gtag('js', new Date());
      gtag('config', measurementId, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });

      window.gtag = gtag;
    };

    // Load GA on first scroll or after 2.5s timeout (whichever comes first)
    const loadOnScroll = () => {
      loadGA();
    };

    document.addEventListener('scroll', loadOnScroll, { passive: true, once: true });

    // Fallback: load after 2.5 seconds if no scroll
    const timeout = setTimeout(loadGA, 2500);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('scroll', loadOnScroll);
    };
  }, [measurementId, shouldLoad]);

  // No DOM rendering needed - script injected dynamically
  return null;
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
