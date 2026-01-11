'use client';
import { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from '@/lib/cookie-consent';
import { Button } from '@/components/ui/button';
import { Cookie, Settings } from 'lucide-react';
import Link from 'next/link';
export function CookieConsentBanner(): JSX.Element {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();
  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-background/95 supports-[backdrop-filter]:bg-background/80 fixed right-0 bottom-0 left-0 z-50 border-t p-4 shadow-lg backdrop-blur"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-start gap-3">
                <div className="bg-primary/10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Cookie className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-semibold">We Value Your Privacy</h3>
                  <p className="text-muted-foreground text-sm">
                    We use cookies to enhance your browsing experience, provide personalized
                    content, and analyze our traffic. You can choose to accept all cookies, reject
                    non-essential ones, or customize your preferences.{' '}
                    <Link
                      href="/privacy"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Learn more
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto">
                <Button variant="outline" size="sm" onClick={openSettings} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Customize
                </Button>
                <Button variant="outline" size="sm" onClick={rejectAll}>
                  Reject All
                </Button>
                <Button size="sm" onClick={acceptAll} className="bg-primary hover:bg-primary/90">
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
