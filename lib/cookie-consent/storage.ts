import { ConsentState, CookieConsentPreferences } from './types';
import { CONSENT_STORAGE_KEY, CONSENT_EXPIRY_DURATION } from './constants';
export const getConsentState = (): ConsentState | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const state: ConsentState = JSON.parse(stored);
    if (Date.now() > state.expiresAt) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }
    return state;
  } catch (error) {
    console.error('Error reading consent state:', error);
    return null;
  }
};
export const saveConsentState = (preferences: CookieConsentPreferences): ConsentState => {
  const timestamp = Date.now();
  const state: ConsentState = {
    hasResponded: true,
    timestamp,
    expiresAt: timestamp + CONSENT_EXPIRY_DURATION,
    preferences,
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving consent state:', error);
  }
  return state;
};
export const clearConsentState = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing consent state:', error);
  }
};
export const hasConsentFor = (category: keyof CookieConsentPreferences): boolean => {
  const state = getConsentState();
  if (!state) {
    return category === 'necessary';
  }
  return state.preferences[category];
};
