'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';

function classifyLink(anchor: HTMLAnchorElement): AnalyticsEventName | null {
  const explicitEvent = anchor.dataset.analyticsEvent as AnalyticsEventName | undefined;
  if (explicitEvent) return explicitEvent;

  const href = anchor.href;
  if (href.startsWith('https://wa.me/')) return 'whatsapp_click';
  if (href.startsWith('tel:')) return 'phone_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (/google\.[^/]+\/maps|maps\.google\.|google\.com\/?q=/i.test(href)) return 'directions_click';

  const url = new URL(href, window.location.href);
  if (url.pathname === '/contact' || url.hash === '#contact') return 'rfq_start';

  return null;
}

/**
 * Central action instrumentation. Event delegation covers links rendered by
 * Server Components as well as client components, so every contact surface is
 * measured consistently without changing how the links behave.
 */
export default function ActionAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const match = pathname.match(/^\/products\/([^/]+)$/);
    if (match) {
      trackEvent('product_view', {
        product_slug: decodeURIComponent(match[1]),
        source_page: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const eventName = classifyLink(anchor);
      if (!eventName) return;

      trackEvent(eventName, {
        source_page: window.location.pathname,
        action_label: anchor.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120),
        contact_method:
          eventName === 'whatsapp_click'
            ? 'whatsapp'
            : eventName === 'phone_click'
              ? 'phone'
              : eventName === 'email_click'
                ? 'email'
                : undefined,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
