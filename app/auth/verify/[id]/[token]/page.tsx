import { JSX } from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth';
import { EmailVerificationHandler } from '@/components/auth/email-verification-handler';

export const metadata: Metadata = {
  title: 'Verify Email | Maltiti A. Enterprise Ltd',
  description: 'Verifying your email address for your Maltiti account.',
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{
    id: string;
    token: string;
  }>;
};

export default async function EmailVerificationPage({
  params,
}: Readonly<PageProps>): Promise<JSX.Element> {
  const { id, token } = await params;

  return (
    <AuthLayout title="Verifying Your Email">
      <EmailVerificationHandler id={id} token={token} />
    </AuthLayout>
  );
}
