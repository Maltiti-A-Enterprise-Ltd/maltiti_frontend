import { JSX } from 'react';
import { AuthLayout, EmailVerificationNotice } from '@/components/auth';

export default function VerifyEmailPage(): JSX.Element {
  return (
    <AuthLayout title="Verify Your Email">
      <EmailVerificationNotice />
    </AuthLayout>
  );
}
