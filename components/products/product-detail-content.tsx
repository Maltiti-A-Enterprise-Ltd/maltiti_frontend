'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ProductResponseDto } from '@/app/api';
import { ProductImageGallery } from './product-image-gallery';
import { ProductInfoSection } from './product-info-section';
import { ProductDetailsTabs } from './product-details-tabs';
import { RelatedProducts } from './related-products';

type ProductDetailContentProps = {
  product: ProductResponseDto;
  relatedProducts: ProductResponseDto[];
};

export function ProductDetailContent({
  product,
  relatedProducts,
}: ProductDetailContentProps): JSX.Element {
  // Get product images
  const productImages =
    product.images && product.images.length > 0
      ? [product.image, ...product.images]
      : product.image
        ? [product.image]
        : ['/placeholder-product.svg'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Icon icon="ph:house" className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/shop?category=${product.category}`}>
                  {product.category.replace(/_/g, ' ')}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-foreground font-medium">{product.name}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Product Section - Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column - Product Images */}
        <ProductImageGallery images={productImages} productName={product.name} />

        {/* Right Column - Product Information */}
        <ProductInfoSection product={product} />
      </div>

      {/* Product Details Tabs */}
      <ProductDetailsTabs product={product} />

      {/* Related Products Section */}
      <RelatedProducts products={relatedProducts} currentProductId={product.id} />
    </div>
  );
}
