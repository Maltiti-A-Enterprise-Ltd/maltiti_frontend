import { JSX, use } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthLayout, ResetPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Reset Password | Maltiti',
  description: 'Create a new password for your Maltiti account.',
};

type ResetPasswordPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default function ResetPasswordPage({ params }: ResetPasswordPageProps): JSX.Element {
  const { token } = use(params);

  console.log('Params', params);

  // Validate token exists
  if (!token) {
    notFound();
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Create a new password for your account. Make sure it's strong and secure."
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
