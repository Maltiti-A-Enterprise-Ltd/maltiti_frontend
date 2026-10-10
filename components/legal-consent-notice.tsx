import { JSX } from 'react';
import Link from 'next/link';

interface LegalConsentNoticeProps {
  /** What the customer is about to do, e.g. "By creating an account". */
  readonly action: string;
  readonly className?: string;
}

/**
 * The line telling a customer which documents an action binds them to.
 *
 * One component rather than the same markup at every decision point, so the
 * wording and the destinations cannot drift apart between sign-up and
 * checkout — if the links ever change, they change once.
 */
export function LegalConsentNotice({
  action,
  className = '',
}: Readonly<LegalConsentNoticeProps>): JSX.Element {
  return (
    <p className={`text-center text-xs text-gray-500 ${className}`.trim()}>
      {action}, you agree to our{' '}
      <Link href="/terms" className="underline hover:text-gray-700">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="underline hover:text-gray-700">
        Privacy Policy
      </Link>
    </p>
  );
}
