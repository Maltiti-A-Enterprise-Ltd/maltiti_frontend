'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * AnalyticsTracker
 *
 * A zero-render client component that fires a GA4 page_view event every time
 * the Next.js App Router navigates to a new URL (pathname or search params).
 *
 * Place this inside a <Suspense> boundary in layout.tsx because
 * useSearchParams() requires it in the App Router.
 *
 * Note: send_page_view is set to false in the gtag config, so this component
 * is solely responsible for all page_view events including the initial load.
 * Events fired before consent is granted are dropped by GA4 automatically;
 * GoogleAnalytics fires a page_view immediately after consent is updated to
 * cover that case.
 */
export function AnalyticsTracker(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}
