'use client';

import { JSX, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { getBestProducts } from '@/lib/store/features/products/productsThunk';
import ProductCard from './product-card';
import { Icon } from '@iconify/react';

const BestProductsSection = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { bestProducts, loading, error } = useAppSelector(({ products }) => products);

  useEffect(() => {
    dispatch(getBestProducts());
  }, [dispatch]);

  // Skeleton loader component
  const ProductCardSkeleton = (): JSX.Element => (
    <div className="border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* Image skeleton */}
      <div className="bg-muted aspect-4/5 w-full animate-pulse" />

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-4">
        <div className="bg-muted mb-2 h-6 w-20 animate-pulse rounded-full" />
        <div className="bg-muted mb-2 h-6 w-3/4 animate-pulse rounded" />
        <div className="bg-muted mb-3 h-4 w-full animate-pulse rounded" />
        <div className="bg-muted mb-3 h-4 w-1/2 animate-pulse rounded" />
        <div className="bg-muted mb-4 h-4 w-2/3 animate-pulse rounded" />
        <div className="flex-1" />
        <div className="bg-muted mb-4 h-8 w-1/2 animate-pulse rounded" />
        <div className="bg-muted h-10 w-full animate-pulse rounded-lg" />
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <section id="best-products" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="bg-muted mx-auto mb-4 h-12 w-64 animate-pulse rounded-lg" />
            <div className="bg-muted mx-auto h-6 w-96 max-w-full animate-pulse rounded" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="best-products" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center rounded-2xl border p-12 text-center">
            <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Icon icon="ph:warning-circle-fill" className="text-destructive h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">Unable to Load Products</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => dispatch(getBestProducts())}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors"
            >
              <Icon icon="ph:arrow-clockwise" className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!bestProducts || bestProducts.length === 0) {
    return (
      <section id="best-products" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-2xl border p-12 text-center">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Icon icon="ph:shopping-bag" className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">No Products Available</h3>
            <p className="text-muted-foreground">Check back soon for our featured products!</p>
          </div>
        </div>
      </section>
    );
  }

  // Success state - Limit to 8-10 products
  const displayProducts = bestProducts.slice(0, 10);

  return (
    <section
      id="best-products"
      className="from-background to-muted/20 scroll-mt-20 bg-linear-to-b px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          {/* Decorative element */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="to-primary h-px w-12 bg-linear-to-r from-transparent" />
            <Icon icon="ph:star-four-fill" className="text-primary h-6 w-6" />
            <div className="to-primary h-px w-12 bg-linear-to-l from-transparent" />
          </div>

          {/* Heading with gradient */}
          <h2 className="from-primary via-primary mb-4 bg-linear-to-r to-green-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
            Best Products
          </h2>

          {/* Subheading */}
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
            Handpicked selections of our premium organic products, crafted with care and quality you
            can trust
          </p>

          {/* Accent line */}
          <div className="from-primary mx-auto mt-6 h-1 w-24 rounded-full bg-linear-to-r to-green-700" />
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1 * (index % 8), // Stagger animation for first 8 items
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-primary/20 inline-flex items-center gap-2 rounded-full border-2 bg-transparent px-8 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-lg">
            View All Products
            <Icon icon="ph:arrow-right" className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BestProductsSection;
