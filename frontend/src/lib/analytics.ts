/**
 * Type-safe Analytics Tracker for Shah Industrial Enterprise.
 * Dispatches events to window.dataLayer (Google Tag Manager / GA4).
 */

export type AnalyticsEventName =
  | 'page_view'
  | 'product_view'
  | 'rfq_start'
  | 'rfq_submit'
  | 'rfq_submit_failed'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'directions_click'
  | 'catalogue_download'
  | 'file_upload'
  | 'calculator_use'
  | 'filter_change';

export interface AnalyticsEventParams {
  product_slug?: string;
  product_title?: string;
  category?: string;
  grade?: string;
  dimensions?: string;
  quantity?: string;
  calculator_shape?: string;
  calculated_weight_kg?: number;
  contact_name?: string;
  contact_method?: string;
  source_page?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params?: AnalyticsEventParams
): void {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...params,
  };

  // Push to dataLayer if available (Google Tag Manager reads this).
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }

  // When GA4 is wired up directly (no tag manager), a raw dataLayer push is not
  // enough — the event has to go through gtag() to be recorded.
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params ?? {});
  }

  // Also log in dev environment
  if (process.env.NODE_ENV === 'development') {
    // console.log(`[Analytics] ${eventName}:`, params);
  }
}
