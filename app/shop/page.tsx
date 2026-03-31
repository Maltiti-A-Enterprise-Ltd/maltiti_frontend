import React, { JSX } from 'react';
import { ShopContent } from '@/components/shop';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: 'Shop Organic Products | Maltiti A. Enterprise Ltd',
  description:
    'Explore our premium collection of organic shea butter, essential oils, soaps, and agricultural products ethically sourced from Northern Ghana.',
  keywords:
    'organic shea butter, essential oils, natural soaps, agricultural products, Ghana, moringa oil, neem oil, baobab oil, wholesale shea butter, black soap',
  path: '/shop',
  ogImageAlt: 'Maltiti A. Enterprise Ltd Products',
});

export default function ShopPage(): JSX.Element {
  return <ShopContent />;
}
