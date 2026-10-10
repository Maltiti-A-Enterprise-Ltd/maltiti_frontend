'use client';

import { JSX } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

/**
 * Where Google sign-in begins. Passport on the API redirects on to Google's
 * consent screen, so the browser leaves the app entirely — a full navigation
 * rather than a fetch.
 */
export const GOOGLE_SIGN_IN_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/google`;

interface GoogleAuthButtonProps {
  /**
   * Sign-in and sign-up are the same endpoint — Google has no separate
   * sign-up, and the API creates the account on first callback when the email
   * is new. Only the wording differs.
   */
  readonly label?: string;
  readonly className?: string;
}

export function GoogleAuthButton({
  label = 'Sign in with Google',
  className = '',
}: Readonly<GoogleAuthButtonProps>): JSX.Element {
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full rounded-lg py-6 text-base font-medium ${className}`.trim()}
      onClick={() => {
        globalThis.location.href = GOOGLE_SIGN_IN_URL;
      }}
    >
      <Icon icon="flat-color-icons:google" className="mr-2 h-5 w-5" />
      {label}
    </Button>
  );
}

/** The "or continue with" rule above the provider buttons. */
export function AuthDivider({
  label = 'or continue with',
}: Readonly<{ label?: string }>): JSX.Element {
  return (
    <div className="relative flex items-center">
      <div className="grow border-t border-gray-200" />
      <span className="mx-4 shrink-0 text-sm text-gray-400">{label}</span>
      <div className="grow border-t border-gray-200" />
    </div>
  );
}
