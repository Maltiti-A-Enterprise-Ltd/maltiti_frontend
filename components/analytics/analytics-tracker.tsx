'use client';

import { useEffect, useRef } from 'react';
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
 */
export function AnalyticsTracker(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render — the GA4 config call in google-analytics.tsx
    // already handles the initial page load implicitly via the 'js' command.
    // We only fire manually on subsequent navigations.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const url = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}
