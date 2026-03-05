'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Component to handle session expiry events
 * Listens for session-expired custom events and shows a toast notification
 */
export function SessionExpiryHandler(): null {
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef<boolean>(false);

  useEffect(() => {
    const handleSessionExpiry = (event: Event): void => {
      const customEvent = event as CustomEvent<{ message: string }>;

      // Show toast notification
      toast.error(customEvent.detail.message || 'Your session has expired. Please login again.', {
        duration: 10000,
      });

      // Redirect to login if not already on an auth page and not already redirecting
      if (!pathname.startsWith('/auth/') && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.push('/auth/login');
      }
    };

    // Listen for session expired events
    globalThis.addEventListener('session-expired', handleSessionExpiry);

    return (): void => {
      globalThis.removeEventListener('session-expired', handleSessionExpiry);
    };
  }, [router, pathname]);

  return null;
}
