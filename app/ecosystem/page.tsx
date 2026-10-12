import { JSX } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ECOSYSTEM_SESSION_COOKIE, resolveEcosystemAccess } from '@/lib/ecosystem/config';
import { verifySessionToken } from '@/lib/ecosystem/session';
import { RosterExplorer } from '@/components/ecosystem/roster-explorer';

/* Reads a cookie in password mode, so it can never be statically rendered or cached. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The women behind the butter',
  description: 'The certified women of Maltiti A. Enterprise Ltd.',
  /* Kept out of search results regardless of access mode. This is the names of eighteen real
     communities and how many women work in each; making it reachable by URL and making it
     indexable are separate decisions, and only the first has been taken. */
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default async function EcosystemPage(): Promise<JSX.Element> {
  const access = resolveEcosystemAccess();

  if (access.mode === 'misconfigured') {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-lg font-semibold text-gray-900">Ecosystem map unavailable</h1>
          <p className="text-sm text-gray-600">{access.reason}</p>
          <p className="mt-2 text-xs text-gray-500">
            The map fails closed rather than falling back to public access.
          </p>
        </div>
      </main>
    );
  }

  if (access.mode === 'password') {
    const token = (await cookies()).get(ECOSYSTEM_SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token, access.config.secret))) {
      redirect('/ecosystem/login');
    }
  }

  return (
    <main className="pt-20">
      <RosterExplorer />
    </main>
  );
}
