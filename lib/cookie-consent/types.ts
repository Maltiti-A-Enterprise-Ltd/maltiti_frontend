export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';
export type CookieConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};
export type ConsentState = {
  hasResponded: boolean;
  timestamp: number;
  expiresAt: number;
  preferences: CookieConsentPreferences;
};
export type CookieCategoryInfo = {
  id: CookieCategory;
  title: string;
  description: string;
  required: boolean;
  examples: string[];
};
