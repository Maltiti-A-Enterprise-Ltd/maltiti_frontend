'use client';

import { JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout, EmailVerificationNotice } from '@/components/auth';

export default function VerifyEmailPage(): JSX.Element {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  return (
    <AuthLayout title="Verify Your Email">
      <EmailVerificationNotice redirect={redirect} />
    </AuthLayout>
  );
}
