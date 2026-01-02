'use client';
import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCookieConsent,
  COOKIE_CATEGORIES,
  CookieConsentPreferences,
} from '@/lib/cookie-consent';
import { Button } from '@/components/ui/button';
import { X, Cookie, Shield, BarChart3, Megaphone, Palette } from 'lucide-react';
import Link from 'next/link';
const categoryIcons = {
  necessary: Shield,
  analytics: BarChart3,
  marketing: Megaphone,
  preferences: Palette,
};
export function CookieSettingsDialog(): JSX.Element {
  const { consentState, isSettingsOpen, closeSettings, savePreferences } = useCookieConsent();
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    necessary: true,
    analytics: consentState?.preferences.analytics ?? false,
    marketing: consentState?.preferences.marketing ?? false,
    preferences: consentState?.preferences.preferences ?? false,
  });
  const handleToggle = (category: keyof CookieConsentPreferences): void => {
    if (category === 'necessary') {
      return;
    }
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  const handleSave = (): void => {
    savePreferences(preferences);
  };
  const handleAcceptAll = (): void => {
    const allAccepted: CookieConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };
  const handleRejectAll = (): void => {
    const onlyNecessary: CookieConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };
  if (!isSettingsOpen) {
    return <></>;
  }
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSettings}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-background relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl"
        >
          <div className="bg-muted/30 flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Cookie className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Cookie Preferences</h2>
                <p className="text-muted-foreground text-sm">Manage your cookie settings</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSettings} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
            <p className="text-muted-foreground mb-6 text-sm">
              We use cookies to improve your experience on our website. You can customize which
              cookies we can use below. Note that strictly necessary cookies are always enabled as
              they are essential for the website to function properly.{' '}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                Read our Privacy Policy
              </Link>
              .
            </p>
            <div className="space-y-4">
              {COOKIE_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category.id];
                const isEnabled = preferences[category.id];
                return (
                  <div
                    key={category.id}
                    className="bg-card hover:bg-muted/30 rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start gap-3">
                        <div className="bg-primary/10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                          <Icon className="text-primary h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{category.title}</h3>
                            {category.required && (
                              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{category.description}</p>
                          <div className="mt-2">
                            <p className="text-muted-foreground text-xs font-medium">Examples:</p>
                            <ul className="text-muted-foreground mt-1 space-y-0.5 text-xs">
                              {category.examples.map((example, idx) => (
                                <li key={idx}>• {example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => handleToggle(category.id)}
                          disabled={category.required}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            isEnabled ? 'bg-primary' : 'bg-muted'
                          } ${
                            category.required ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-muted/30 flex flex-col gap-2 border-t p-6 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Button variant="outline" size="sm" onClick={handleAcceptAll}>
                Accept All
              </Button>
            </div>
            <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Save Preferences
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
