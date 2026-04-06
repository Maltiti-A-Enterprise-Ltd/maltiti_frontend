'use client';

import { JSX } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth';
import { Button } from '@/components/ui/button';

export default function OAuthErrorPage(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawMessage = searchParams.get('message') ?? 'An unexpected error occurred during sign in.';
  const errorMessage = decodeURIComponent(rawMessage);

  return (
    <AuthLayout title="Sign In Failed" subtitle="We couldn't complete your Google sign in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="rounded-full bg-red-100 p-6"
          >
            <XCircle className="h-12 w-12 text-red-600" />
          </motion.div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() =>
              (globalThis.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/google`)
            }
            className="w-full"
          >
            Try Again with Google
          </Button>
          <Button variant="outline" onClick={() => router.push('/auth/login')} className="w-full">
            Back to Login
          </Button>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
