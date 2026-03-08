import { JSX } from 'react';
import { AuthLayout, ResendVerificationForm } from '@/components/auth';

export default function ResendVerificationPage(): JSX.Element {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue shopping">
      <ResendVerificationForm />
    </AuthLayout>
  );
}
