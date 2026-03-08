import { JSX } from 'react';
import { Metadata } from 'next';
import { AuthLayout, ForgotPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Forgot Password | Maltiti',
  description:
    'Reset your Maltiti account password. Enter your email to receive a password reset link.',
};

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Don't worry, we'll help you reset it. Enter your email address below."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
