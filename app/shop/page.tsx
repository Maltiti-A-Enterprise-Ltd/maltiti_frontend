import React, { JSX } from 'react';
import { Metadata } from 'next';
import { ShopContent } from '@/components/shop';

export const metadata: Metadata = {
  title: 'Shop Organic Products | Maltiti A. Enterprise Ltd',
  description:
    'Explore our premium collection of organic shea butter, essential oils, soaps, and agricultural products ethically sourced from Northern Ghana.',
  keywords:
    'organic shea butter, essential oils, natural soaps, agricultural products, Ghana, moringa oil, neem oil, baobab oil, wholesale shea butter, black soap',
  alternates: {
    canonical: 'https://maltitiaenterprise.com/shop',
  },
  openGraph: {
    title: 'Shop Organic Products | Maltiti A. Enterprise Ltd',
    description:
      'Premium organic products including shea butter, essential oils, soaps, and agricultural products from Northern Ghana.',
    type: 'website',
    url: 'https://maltitiaenterprise.com/shop',
    siteName: 'Maltiti A. Enterprise Ltd',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Maltiti A. Enterprise Ltd Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Organic Products | Maltiti A. Enterprise Ltd',
    description:
      'Premium organic products including shea butter, essential oils, soaps, and agricultural products from Northern Ghana.',
    images: ['/og-image.jpg'],
  },
};

export default function ShopPage(): JSX.Element {
  return <ShopContent />;
}
