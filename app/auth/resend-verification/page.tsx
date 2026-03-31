import { JSX } from 'react';
import type { Metadata } from 'next';
import { AuthLayout, ResendVerificationForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Resend Verification | Maltiti A. Enterprise Ltd',
  description: 'Resend your email verification link for your Maltiti account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResendVerificationPage(): JSX.Element {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue shopping">
      <ResendVerificationForm />
    </AuthLayout>
  );
}
