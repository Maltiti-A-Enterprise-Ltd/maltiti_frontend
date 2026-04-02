'use client';

import Script from 'next/script';
import { useEffect, JSX } from 'react';
import { GA_MEASUREMENT_ID, getConsentInitScript, updateGtagConsent, trackPageView } from '@/lib/analytics';
import { CookieConsentPreferences } from '@/lib/cookie-consent';

/**
 * Google Analytics
 *
 * Loads the GA4 gtag.js script with strategy="afterInteractive" so it never
 * blocks the critical rendering path.
 *
 * Consent Management:
 *   – Default consent is set to "denied" (GDPR-friendly) via an inline script
 *     that runs before gtag.js is fetched.
 *   – Listens to the `cookieConsentChanged` custom event emitted by the
 *     CookieConsentProvider and immediately updates the GA4 consent mode.
 */
export function GoogleAnalytics(): JSX.Element {
  useEffect(() => {
    const handleConsentChange = (e: Event): void => {
      const preferences = (e as CustomEvent<CookieConsentPreferences>).detail;
      updateGtagConsent(preferences.analytics);

      // Fire a page_view immediately after consent is granted so the current
      // page is tracked — covers both return visitors (consent restored on load)
      // and first-time visitors accepting the banner.
      if (preferences.analytics) {
        const url = window.location.search
          ? `${window.location.pathname}${window.location.search}`
          : window.location.pathname;
        trackPageView(url);
      }
    };

    globalThis.addEventListener('cookieConsentChanged', handleConsentChange);
    return (): void => {
      globalThis.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  return (
    <>
      {/* Inline consent-default script — runs synchronously before gtag loads */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script
        id="ga4-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: getConsentInitScript() }}
      />

      {/* gtag.js loader */}
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      {/* gtag initialisation */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
              cookie_flags: 'SameSite=None;Secure'
            });
          `.trim(),
        }}
      />
    </>
  );
}
