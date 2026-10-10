'use client';

import { JSX } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { AuthErrorPanel } from '@/components/auth/auth-error-panel';
import { Button } from '@/components/ui/button';
import { GOOGLE_SIGN_IN_URL } from '@/components/auth/google-auth-button';

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred during sign in.';

/**
 * decodeURIComponent throws a URIError on a malformed escape — '%E0%A4%A' is
 * enough — and the message arrives from a query string anyone can edit. A
 * crashed error page is a worse failure than the one it was reporting.
 */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
}

export default function OAuthErrorPage(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawMessage = searchParams.get('message') ?? DEFAULT_ERROR_MESSAGE;
  const errorMessage = safeDecode(rawMessage);

  return (
    <AuthLayout title="Sign In Failed" subtitle="We couldn't complete your Google sign in">
      <AuthErrorPanel>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              globalThis.location.href = GOOGLE_SIGN_IN_URL;
            }}
            className="w-full"
          >
            Try Again with Google
          </Button>
          <Button variant="outline" onClick={() => router.push('/auth/login')} className="w-full">
            Back to Login
          </Button>
        </div>
      </AuthErrorPanel>
    </AuthLayout>
  );
}
