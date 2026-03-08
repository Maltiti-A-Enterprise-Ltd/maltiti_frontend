'use client';

import React, { JSX, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { verifyEmail } from '@/lib/store/features/auth/authThunk';
import {
  selectVerifyEmailLoading,
  selectVerifyEmailError,
} from '@/lib/store/features/auth/authSelectors';

type EmailVerificationHandlerProps = {
  id: string;
  token: string;
};

export function EmailVerificationHandler({
  id,
  token,
}: EmailVerificationHandlerProps): JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector(selectVerifyEmailLoading);
  const error = useAppSelector(selectVerifyEmailError);
  const [verificationStatus, setVerificationStatus] = React.useState<
    'loading' | 'success' | 'error'
  >('loading');

  useEffect(() => {
    const verify = async (): Promise<void> => {
      try {
        await dispatch(verifyEmail({ id, token })).unwrap();
        setVerificationStatus('success');
        // Redirect to home page after 3 seconds (user is now logged in)
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch {
        setVerificationStatus('error');
      }
    };

    verify();
  }, [dispatch, id, token, router]);

  if (verificationStatus === 'loading' || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
            <div className="bg-primary/10 relative rounded-full p-6">
              <Loader2 className="text-primary h-12 w-12 animate-spin" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-foreground text-xl font-semibold">Verifying Your Email</h3>
          <p className="text-muted-foreground">Please wait while we verify your email address...</p>
        </div>
      </motion.div>
    );
  }

  if (verificationStatus === 'success') {
    return (
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
            className="rounded-full bg-green-100 p-6"
          >
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </motion.div>
        </div>
        <div className="space-y-2">
          <h3 className="text-foreground text-xl font-semibold">Email Verified Successfully!</h3>
          <p className="text-muted-foreground">
            Your email has been verified and you are now logged in. You will be redirected to the
            home page shortly...
          </p>
        </div>
        <Button onClick={() => router.push('/')} className="w-full">
          Go to Home
        </Button>
      </motion.div>
    );
  }

  return (
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
      <div className="space-y-2">
        <h3 className="text-foreground text-xl font-semibold">Verification Failed</h3>
        <p className="text-muted-foreground">
          {error || 'The verification link is invalid or has expired.'}
        </p>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900">What to do next:</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
                <li>Request a new verification email</li>
                <li>Check if you already verified your email</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={() => router.push('/auth/resend-verification')} className="w-full">
            Resend Verification Email
          </Button>
          <Button onClick={() => router.push('/auth/login')} variant="outline" className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
      <div className="text-muted-foreground text-sm">
        Need help?{' '}
        <Link href="/contact" className="text-primary font-medium hover:underline">
          Contact Support
        </Link>
      </div>
    </motion.div>
  );
}
