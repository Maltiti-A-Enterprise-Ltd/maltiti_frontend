'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductResponseDto } from '@/app/api';
import { ProductCard } from '@/components/products/index';

type RelatedProductsProps = {
  products: ProductResponseDto[];
  currentProductId: string;
};

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps): JSX.Element {
  // Filter out current product and limit to 4
  const relatedProducts = products.filter((p) => p.id !== currentProductId).slice(0, 4);

  if (relatedProducts.length === 0) {
    return <></>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-16"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
            Related Products
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            You might also be interested in these products
          </p>
        </div>
        <Link
          href="/shop"
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <Link href={`/shop/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
