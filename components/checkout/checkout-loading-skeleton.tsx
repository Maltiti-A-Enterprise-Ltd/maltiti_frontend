'use client';

import { JSX } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutLoadingSkeleton = (): JSX.Element => (
  <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
    <div className="mx-auto max-w-7xl">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-10 w-20" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-2 h-6 w-96" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Skeleton className="mb-4 h-6 w-48" />
            <Skeleton className="mb-2 h-4 w-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="flex items-center gap-4 rounded-lg border bg-green-50/50 p-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <div className="mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-2 h-4 w-48" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading your cart...</span>
      </div>
    </div>
  </div>
);

export default CheckoutLoadingSkeleton;
