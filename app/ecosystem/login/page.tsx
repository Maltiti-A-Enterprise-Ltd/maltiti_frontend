import { JSX } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { resolveEcosystemAccess } from '@/lib/ecosystem/config';
import { EcosystemLoginForm } from '@/components/ecosystem/login-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ecosystem Map — Sign in',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function EcosystemLoginPage(): JSX.Element {
  /* Nothing to sign in to when the map is public — send stale bookmarks straight to the map. */
  if (resolveEcosystemAccess().mode !== 'password') {
    redirect('/ecosystem');
  }

  return (
    <main className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-6 pt-20">
      <EcosystemLoginForm />
    </main>
  );
}
