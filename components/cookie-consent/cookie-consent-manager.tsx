'use client';
import { JSX, useEffect } from 'react';
import { CookieConsentBanner } from './cookie-consent-banner';
import { CookieSettingsDialog } from './cookie-settings-dialog';
import { setupConsentListener } from '@/lib/cookie-consent';
export function CookieConsentManager(): JSX.Element {
  useEffect(() => {
    setupConsentListener();
  }, []);
  return (
    <>
      <CookieConsentBanner />
      <CookieSettingsDialog />
    </>
  );
}
