'use client';

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProductGridSkeleton({
  count = 12,
  className,
}: ProductGridSkeletonProps): JSX.Element {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} delay={index * 0.05} />
      ))}
    </div>
  );
}

type ProductCardSkeletonProps = {
  delay?: number;
};

function ProductCardSkeleton({ delay = 0 }: ProductCardSkeletonProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm"
    >
      {/* Image skeleton */}
      <div className="bg-muted relative aspect-4/5 w-full overflow-hidden">
        <div className="shimmer absolute inset-0" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        {/* Badge skeleton */}
        <div className="shimmer h-5 w-20 rounded-full" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="shimmer h-5 w-full rounded" />
          <div className="shimmer h-5 w-3/4 rounded" />
        </div>

        {/* Weight skeleton */}
        <div className="shimmer h-4 w-24 rounded" />

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="shimmer h-4 w-24 rounded" />
          <div className="shimmer h-4 w-16 rounded" />
        </div>

        {/* Spacer */}
        <div className="h-4" />

        {/* Price skeleton */}
        <div className="shimmer h-8 w-32 rounded" />

        {/* Button skeleton */}
        <div className="shimmer h-10 w-full rounded-md" />
      </div>

      <style>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(229, 231, 235, 1) 0%,
            rgba(243, 244, 246, 1) 50%,
            rgba(229, 231, 235, 1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
