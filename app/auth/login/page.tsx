'use client';

import { JSX, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout, LoginForm } from '@/components/auth';

export default function LoginPage(): JSX.Element {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (redirect) {
      sessionStorage.setItem('returnUrl', redirect);
    }
  }, [redirect]);

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue shopping">
      <LoginForm />
    </AuthLayout>
  );
}
