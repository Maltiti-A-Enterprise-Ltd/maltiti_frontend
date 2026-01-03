'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Component to handle session expiry events
 * Listens for session-expired custom events and shows a toast notification
 */
export function SessionExpiryHandler(): null {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleSessionExpiry = (event: Event): void => {
      const customEvent = event as CustomEvent<{ message: string }>;

      // Show toast notification
      toast.error(customEvent.detail.message || 'Your session has expired. Please login again.', {
        duration: 10000,
      });
    };

    // Listen for session expired events
    window.addEventListener('session-expired', handleSessionExpiry);

    return (): void => {
      window.removeEventListener('session-expired', handleSessionExpiry);
    };
  }, [router, pathname]);

  return null;
}
