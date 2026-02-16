'use client';

import { JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout, SignupForm } from '@/components/auth';

export default function SignupPage(): JSX.Element {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join us and start exploring quality shea butter products"
    >
      <SignupForm redirect={redirect} />
    </AuthLayout>
  );
}
