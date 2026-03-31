import type { Metadata } from 'next';

const BASE_URL = 'https://maltitiaenterprise.com';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

type PageMetadataOptions = {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  type?: 'website' | 'article';
};

export function buildPageMetadata({
  title,
  description,
  keywords,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const imageAlt = ogImageAlt ?? title;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: 'Maltiti A. Enterprise Ltd',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
