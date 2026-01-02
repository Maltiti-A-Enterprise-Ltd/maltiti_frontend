import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { JSX, ReactNode } from 'react';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import StoreProvider from '@/app/storeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Maltiti A. Enterprise Ltd | Organic Shea Butter & Natural Products',
  description: `Discover high-quality shea butter, essential oils, and black soap from Maltiti A. Enterprise Ltd. 
    Ethical sourcing, sustainable products from Ghana.`,
  keywords: `Maltiti A. Enterprise Ltd, maltiti, shea butter ghana, shea butter, organic shea butter, Ghana shea products, 
    black soap, moringa oil, dawadawa tea, essential oils, wholesale shea butter, raw shea butter, 
    shea butter cosmetics, rice processing, baobab oil, neem oil, palm kernel oil, shea oil, agricultural exports Ghana`,
  metadataBase: new URL('https://maltitiaenterprise.com'),
  openGraph: {
    title: 'Maltiti A. Enterprise Ltd',
    description: 'Authentic unrefined shea butter and essential oils, ethically produced in Ghana.',
    url: 'https://maltitiaenterprise.com',
    type: 'website',
    images: [
      {
        url: '/social-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Maltiti A. Enterprise Ltd - Organic Shea Butter & Natural Products',
      },
    ],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#5A4036',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SmoothScroll />
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
