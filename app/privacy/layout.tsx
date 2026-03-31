import type { Metadata } from 'next';
import { ReactNode, JSX } from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Maltiti A. Enterprise Ltd',
  description:
    'Read the Maltiti A. Enterprise Ltd Privacy Policy to understand how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://maltitiaenterprise.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return <>{children}</>;
}
