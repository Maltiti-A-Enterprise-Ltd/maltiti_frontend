import { JSX } from 'react';
import { AuthLayout, LoginForm } from '@/components/auth';

export default function LoginPage(): JSX.Element {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue shopping">
      <LoginForm />
    </AuthLayout>
  );
}
