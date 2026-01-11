import { JSX } from 'react';
import { AuthLayout } from '@/components/auth';
import { EmailVerificationHandler } from '@/components/auth/email-verification-handler';

type PageProps = {
  params: Promise<{
    id: string;
    token: string;
  }>;
};

export default async function EmailVerificationPage({ params }: PageProps): Promise<JSX.Element> {
  const { id, token } = await params;

  return (
    <AuthLayout title="Verifying Your Email">
      <EmailVerificationHandler id={id} token={token} />
    </AuthLayout>
  );
}
