import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { JSX, ReactNode } from 'react';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import StoreProvider from '@/app/storeProvider';
import { CookieConsentProvider } from '@/lib/cookie-consent';
import { CookieConsentManager } from '@/components/cookie-consent';
import { NavBar } from '@/components/navbar';
import { SessionExpiryHandler } from '@/components/auth';
import { NotificationProvider, NotificationToastContainer } from '@/components/notifications';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/json-ld';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Maltiti A. Enterprise Ltd | Organic Shea Butter & Natural Products',
    template: '%s | Maltiti A. Enterprise Ltd',
  },
  description: `Discover high-quality shea butter, essential oils, and black soap from Maltiti A. Enterprise Ltd. 
    Ethical sourcing, sustainable products from Ghana.`,
  keywords: `Maltiti A. Enterprise Ltd, maltiti, shea butter ghana, shea butter, organic shea butter, Ghana shea products, 
    black soap, moringa oil, dawadawa tea, essential oils, wholesale shea butter, raw shea butter, 
    shea butter cosmetics, rice processing, baobab oil, neem oil, palm kernel oil, shea oil, agricultural exports Ghana`,
  metadataBase: new URL('https://maltitiaenterprise.com'),
  alternates: {
    canonical: 'https://maltitiaenterprise.com',
  },
  authors: [{ name: 'Maltiti A. Enterprise Ltd', url: 'https://maltitiaenterprise.com' }],
  creator: 'Maltiti A. Enterprise Ltd',
  publisher: 'Maltiti A. Enterprise Ltd',
  category: 'ecommerce',
  openGraph: {
    title: 'Maltiti A. Enterprise Ltd | Organic Shea Butter & Natural Products',
    description: 'Authentic unrefined shea butter and essential oils, ethically produced in Ghana.',
    url: 'https://maltitiaenterprise.com',
    siteName: 'Maltiti A. Enterprise Ltd',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Maltiti A. Enterprise Ltd - Organic Shea Butter & Natural Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maltiti A. Enterprise Ltd | Organic Shea Butter & Natural Products',
    description: 'Authentic unrefined shea butter and essential oils, ethically produced in Ghana.',
    images: ['/og-image.jpg'],
    creator: '@maltitienterprise',
    site: '@maltitienterprise',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-token',
  },
  other: {
    'link:preconnect': 'https://maltiti.s3.amazonaws.com',
  },
};

export const viewport: Viewport = {
  themeColor: '#5A4036',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <StoreProvider>
          <NotificationProvider>
            <SessionExpiryHandler />
            <NavBar />
            <CookieConsentProvider>
              <SmoothScroll />
              {children}
              <Toaster />
              <Footer />
              <CookieConsentManager />
            </CookieConsentProvider>
            <NotificationToastContainer />
          </NotificationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
