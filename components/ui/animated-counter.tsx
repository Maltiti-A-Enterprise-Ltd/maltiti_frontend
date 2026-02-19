'use client';

import { JSX, useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

type AnimatedCounterProps = {
  value: string | number;
  className?: string;
};

/**
 * A component that animates a numeric value from zero to its target value when it comes into view.
 * It intelligently handles strings containing numbers (e.g., "5,000+", "100s").
 */
export function AnimatedCounter({ value, className }: Readonly<AnimatedCounterProps>): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const stringValue = String(value);
  // Matches the first sequence of digits, commas, or dots
  const numericMatch = new RegExp(/([\d,.]+)/).exec(stringValue);
  const numericPart = numericMatch ? numericMatch[0] : null;
  const cleanNumericPart = numericPart ? numericPart.replaceAll(',', '') : null;
  const numberValue = cleanNumericPart ? Number.parseFloat(cleanNumericPart) : null;

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
  });

  useEffect(() => {
    if (inView && numberValue !== null) {
      motionValue.set(numberValue);
    }
  }, [inView, motionValue, numberValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current && numberValue !== null && numericMatch) {
        // use Math.floor for integers or a fixed decimal for floats if needed
        const isFloat = numericPart?.includes('.');
        const formatted = isFloat
          ? latest.toFixed(1)
          : new Intl.NumberFormat().format(Math.floor(latest));

        // Reconstruct the string by replacing the original numeric part
        ref.current.textContent = stringValue.replace(numericMatch[0], formatted);
      }
    });
    return () => unsubscribe();
  }, [springValue, stringValue, numericMatch, numberValue, numericPart]);

  if (numberValue === null) {
    return <span className={className}>{value}</span>;
  }

  const initialDisplay = stringValue.replace(numericMatch![0], '0');

  return (
    <span ref={ref} className={className}>
      {initialDisplay}
    </span>
  );
}
