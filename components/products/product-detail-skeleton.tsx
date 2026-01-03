'use client';

import { JSX } from 'react';

export function ProductDetailSkeleton(): JSX.Element {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="bg-muted mb-8 h-5 w-64 rounded" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Section Skeleton */}
        <div>
          {/* Main Image */}
          <div className="bg-muted mb-4 aspect-square rounded-2xl" />

          {/* Thumbnail Gallery */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted aspect-square w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          {/* Category & Status */}
          <div className="flex gap-2">
            <div className="bg-muted h-6 w-24 rounded-full" />
            <div className="bg-muted h-6 w-20 rounded-full" />
          </div>

          {/* Product Name */}
          <div className="bg-muted h-10 w-3/4 rounded" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="bg-muted h-4 w-32 rounded" />
            <div className="bg-muted h-4 w-20 rounded" />
          </div>

          {/* Price */}
          <div className="bg-muted h-12 w-40 rounded" />

          {/* Short Description */}
          <div className="space-y-2">
            <div className="bg-muted h-4 w-full rounded" />
            <div className="bg-muted h-4 w-5/6 rounded" />
            <div className="bg-muted h-4 w-4/5 rounded" />
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-4">
            <div className="bg-muted h-12 w-32 rounded" />
            <div className="flex gap-3">
              <div className="bg-muted h-12 flex-1 rounded-lg" />
              <div className="bg-muted h-12 w-12 rounded-lg" />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 border-t pt-6">
            <div className="bg-muted h-4 w-48 rounded" />
            <div className="bg-muted h-4 w-56 rounded" />
            <div className="bg-muted h-4 w-52 rounded" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-16 space-y-4">
        <div className="flex gap-4">
          <div className="bg-muted h-10 w-32 rounded" />
          <div className="bg-muted h-10 w-32 rounded" />
          <div className="bg-muted h-10 w-32 rounded" />
        </div>
        <div className="space-y-3">
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-11/12 rounded" />
          <div className="bg-muted h-4 w-10/12 rounded" />
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <div className="bg-muted mb-6 h-8 w-48 rounded" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="bg-muted aspect-4/5 rounded-2xl" />
              <div className="bg-muted h-4 w-3/4 rounded" />
              <div className="bg-muted h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
