'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScroll(): null {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number): void {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return (): void => {
      lenis.destroy();
    };
  }, []);

  return null;
}
