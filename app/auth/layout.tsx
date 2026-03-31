import type { Metadata } from 'next';
import { ReactNode, JSX } from 'react';

export const metadata: Metadata = {
  title: 'Account | Maltiti A. Enterprise Ltd',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <>{children}</>;
}
