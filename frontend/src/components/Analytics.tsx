import Script from "next/script";

/**
 * Loads the measurement container so the events already emitted by
 * `lib/analytics.ts` (rfq_submit, whatsapp_click, phone_click, calculator_use…)
 * actually reach a reporting tool. Without this, every trackEvent() call pushed
 * into a dataLayer that nothing ever read.
 *
 * Set exactly one of these in the deployment environment:
 *   NEXT_PUBLIC_GTM_ID  — e.g. GTM-XXXXXXX   (preferred: tags managed in GTM)
 *   NEXT_PUBLIC_GA_ID   — e.g. G-XXXXXXXXXX  (GA4 direct, no tag manager)
 *
 * With neither set, nothing is loaded and no third-party request is made — so
 * local development and previews stay clean.
 */
export default function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (gtmId) {
    return (
      <>
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`}
        </Script>
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
        />
      </>
    );
  }

  if (gaId) {
    return (
      <>
        <Script
          id="ga4-loader"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaId}');`}
        </Script>
      </>
    );
  }

  return null;
}
