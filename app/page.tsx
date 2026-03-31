import { JSX } from 'react';
import type { Metadata } from 'next';
import Home from '@/components/home/home';
import { getBreadcrumbSchema } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://maltitiaenterprise.com',
  },
};

export default function HomePage(): JSX.Element {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://maltitiaenterprise.com' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Home />
    </>
  );
}
