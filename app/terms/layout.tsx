import type { Metadata } from 'next';
import { ReactNode, JSX } from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Maltiti A. Enterprise Ltd',
  description:
    'Read the Maltiti A. Enterprise Ltd Terms & Conditions covering orders, payments, shipping, refunds, and more.',
  alternates: {
    canonical: 'https://maltitiaenterprise.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <>{children}</>;
}
