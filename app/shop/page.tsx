import React, { JSX } from 'react';
import { Metadata } from 'next';
import { ShopContent } from '@/components/shop';

export const metadata: Metadata = {
  title: 'Shop Organic Products | Maltiti A. Enterprise Ltd',
  description:
    'Explore our premium collection of organic shea butter, essential oils, soaps, and agricultural products ethically sourced from Northern Ghana.',
  keywords:
    'organic shea butter, essential oils, natural soaps, agricultural products, Ghana, moringa oil, neem oil, baobab oil',
  openGraph: {
    title: 'Shop Organic Products | Maltiti A. Enterprise Ltd',
    description:
      'Premium organic products including shea butter, essential oils, soaps, and agricultural products from Northern Ghana.',
    type: 'website',
    images: [
      {
        url: '/og-shop.jpg',
        width: 1200,
        height: 630,
        alt: 'Maltiti A. Enterprise Ltd Products',
      },
    ],
  },
};

export default function ShopPage(): JSX.Element {
  return <ShopContent />;
}
