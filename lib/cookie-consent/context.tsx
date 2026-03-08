'use client';
import { createContext, useContext, useState, useEffect, ReactNode, JSX } from 'react';
import { ConsentState, CookieConsentPreferences } from './types';
import { getConsentState, saveConsentState, clearConsentState, hasConsentFor } from './storage';
type CookieConsentContextValue = {
  consentState: ConsentState | null;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: CookieConsentPreferences) => void;
  resetConsent: () => void;
  hasConsentFor: (category: keyof CookieConsentPreferences) => boolean;
  openSettings: () => void;
  closeSettings: () => void;
  isSettingsOpen: boolean;
};
const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);
type CookieConsentProviderProps = {
  children: ReactNode;
};
export function CookieConsentProvider({ children }: CookieConsentProviderProps): JSX.Element {
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const state = getConsentState();
    setConsentState(state);
    setShowBanner(!state);
    setIsInitialized(true);
  }, []);
  const acceptAll = (): void => {
    const preferences: CookieConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    const newState = saveConsentState(preferences);
    setConsentState(newState);
    setShowBanner(false);
    setIsSettingsOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
    }
  };
  const rejectAll = (): void => {
    const preferences: CookieConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    const newState = saveConsentState(preferences);
    setConsentState(newState);
    setShowBanner(false);
    setIsSettingsOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
    }
  };
  const savePreferences = (preferences: CookieConsentPreferences): void => {
    const newState = saveConsentState(preferences);
    setConsentState(newState);
    setShowBanner(false);
    setIsSettingsOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
    }
  };
  const resetConsent = (): void => {
    clearConsentState();
    setConsentState(null);
    setShowBanner(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentReset'));
    }
  };
  const openSettings = (): void => {
    setIsSettingsOpen(true);
  };
  const closeSettings = (): void => {
    setIsSettingsOpen(false);
  };
  const value: CookieConsentContextValue = {
    consentState,
    showBanner: showBanner && isInitialized,
    acceptAll,
    rejectAll,
    savePreferences,
    resetConsent,
    hasConsentFor: (category) => hasConsentFor(category),
    openSettings,
    closeSettings,
    isSettingsOpen,
  };
  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}
export const useCookieConsent = (): CookieConsentContextValue => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
};
