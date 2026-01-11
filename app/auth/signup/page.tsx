import { JSX } from 'react';
import { AuthLayout, SignupForm } from '@/components/auth';

export default function SignupPage(): JSX.Element {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join us and start exploring quality shea butter products"
    >
      <SignupForm />
    </AuthLayout>
  );
}
