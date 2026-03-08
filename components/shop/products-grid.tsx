'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products';
import { ProductResponseDto } from '@/app/api';

type ProductsGridProps = {
  products: ProductResponseDto[];
};

export function ProductsGrid({ products }: ProductsGridProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link href={`/shop/${product.id}`} className="block h-full">
            <ProductCard product={product} className="h-full" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
