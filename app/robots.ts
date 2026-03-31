import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/shop', '/shop/', '/blog', '/blog/', '/privacy', '/terms'],
        disallow: [
          '/auth/',
          '/checkout',
          '/checkout/',
          '/notifications',
          '/notifications/',
          '/settings',
          '/settings/',
          '/track-order/',
          '/confirm-payment/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/shop', '/blog', '/privacy', '/terms'],
        disallow: [
          '/auth/',
          '/checkout',
          '/notifications',
          '/settings',
          '/track-order/',
          '/confirm-payment/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://maltitiaenterprise.com/sitemap.xml',
    host: 'https://maltitiaenterprise.com',
  };
}
