import { JSX } from 'react';
import { Metadata } from 'next';
import { NotFoundContent } from '@/components/404';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Maltiti A. Enterprise Ltd',
  description:
    "The page you're looking for couldn't be found. Explore our organic shea butter and natural products from Ghana.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound(): JSX.Element {
  return <NotFoundContent />;
}
