'use client';

import { FormEvent, JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Shared-credential gate for the ecosystem map.
 *
 * The credentials are posted to the server and checked there. Nothing about the model reaches
 * the browser until the server has issued a signed session cookie.
 */
export function EcosystemLoginForm(): JSX.Element {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/ecosystem/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        router.replace('/ecosystem');
        router.refresh();
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? 'Sign in failed.');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0f6938]/10">
          <Lock className="h-4 w-4 text-[#0f6938]" />
        </span>
        <h1 className="text-lg font-semibold text-gray-900">Maltiti Ecosystem Map</h1>
        <p className="mt-1 text-sm text-gray-600">
          Internal knowledge model. Sign in with the shared access credentials.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ecosystem-username">Username</Label>
          <Input
            id="ecosystem-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ecosystem-password">Password</Label>
          <Input
            id="ecosystem-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
        This page shows internal, partly unverified information about Maltiti&apos;s operations. Do
        not share the credentials or screenshots outside the company.
      </p>
    </div>
  );
}
