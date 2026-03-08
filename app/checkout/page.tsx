'use client';
import dynamic from 'next/dynamic';
import { JSX } from 'react';

// Lazy load the checkout page component
const CheckoutPage = dynamic(() => import('@/components/checkout/checkout-page'), {
  loading: () => (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-10 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-6 w-96 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 space-y-4">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            <div className="rounded-lg border bg-green-50/50 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-green-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 space-y-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-16 w-16 animate-pulse rounded-md bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                      </div>
                      <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          <span>Loading checkout...</span>
        </div>
      </div>
    </div>
  ),
});

export default function Checkout(): JSX.Element {
  return <CheckoutPage />;
}
