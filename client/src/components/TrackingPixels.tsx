import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Facebook Pixel + Google Analytics tracking for BIB funnel pages.
 * 
 * Configure pixel IDs via environment variables:
 * - VITE_FB_PIXEL_ID: Facebook Pixel ID
 * - VITE_GA_MEASUREMENT_ID: Google Analytics 4 Measurement ID
 * 
 * This component:
 * 1. Loads the FB Pixel and GA4 scripts on mount
 * 2. Tracks page views on route changes
 * 3. Provides helper functions for conversion events
 */

const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || "";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

// Extend window for FB Pixel and gtag
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/** Initialize Facebook Pixel */
function initFBPixel() {
  if (!FB_PIXEL_ID || typeof window === "undefined") return;
  if (typeof window.fbq === "function") return; // Already initialized

  const n: any = (window.fbq = function (...args: any[]) {
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", FB_PIXEL_ID);
  window.fbq("track", "PageView");
}

/** Initialize Google Analytics 4 */
function initGA4() {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  if (typeof window.gtag === "function") return; // Already initialized

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: true,
  });
}

/** Track a page view */
export function trackPageView(url: string) {
  if (FB_PIXEL_ID && window.fbq) {
    window.fbq("track", "PageView");
  }
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", "page_view", { page_path: url });
  }
}

/** Track BIB funnel events */
export function trackFunnelEvent(
  eventName: "ViewContent" | "InitiateCheckout" | "Purchase" | "AddToCart",
  data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
  }
) {
  if (FB_PIXEL_ID && window.fbq) {
    window.fbq("track", eventName, {
      value: data?.value,
      currency: data?.currency || "USD",
      content_name: data?.content_name,
      content_category: data?.content_category || "BIB",
    });
  }
  if (GA_MEASUREMENT_ID && window.gtag) {
    const gaEventMap: Record<string, string> = {
      ViewContent: "view_item",
      InitiateCheckout: "begin_checkout",
      Purchase: "purchase",
      AddToCart: "add_to_cart",
    };
    window.gtag("event", gaEventMap[eventName] || eventName, {
      value: data?.value,
      currency: data?.currency || "USD",
      items: [{ item_name: data?.content_name }],
    });
  }
}

/** Track custom events */
export function trackCustomEvent(eventName: string, params?: Record<string, any>) {
  if (FB_PIXEL_ID && window.fbq) {
    window.fbq("trackCustom", eventName, params);
  }
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/**
 * TrackingPixels component — add to BIB funnel layout.
 * Initializes FB Pixel and GA4, tracks page views on route changes.
 */
export default function TrackingPixels() {
  const [location] = useLocation();

  // Initialize on mount
  useEffect(() => {
    initFBPixel();
    initGA4();
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  // Render noscript fallback for FB Pixel
  if (!FB_PIXEL_ID && !GA_MEASUREMENT_ID) return null;

  return (
    <>
      {FB_PIXEL_ID && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
