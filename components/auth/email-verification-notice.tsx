'use client';

import React, { JSX, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmailVerificationNoticeProps {
  email?: string;
  onResend?: () => Promise<void>;
}

export function EmailVerificationNotice({
  email,
  onResend,
}: EmailVerificationNoticeProps): JSX.Element {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string>('');

  const handleResend = async (): Promise<void> => {
    if (!onResend) {
      return;
    }

    try {
      setIsResending(true);
      setResendError('');
      await onResend();
      setResendSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch {
      setResendError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
      >
        <Mail className="h-10 w-10 text-green-600" />
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Check Your Email</h2>
        <p className="text-gray-600">
          We&apos;ve sent a verification link to{' '}
          {email ? <span className="font-medium text-gray-900">{email}</span> : 'your email'}
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-gray-50 p-6 text-sm">
        <h3 className="mb-3 font-semibold text-gray-900">What to do next:</h3>
        <ol className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="mt-0.5 mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
              1
            </span>
            <span>Check your email inbox for the verification message</span>
          </li>
          <li className="flex items-start">
            <span className="mt-0.5 mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
              2
            </span>
            <span>Click the verification link in the email</span>
          </li>
          <li className="flex items-start">
            <span className="mt-0.5 mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
              3
            </span>
            <span>Return here to log in to your account</span>
          </li>
        </ol>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-gray-500">
        Didn&apos;t receive the email? Check your spam folder or request a new one below.
      </p>

      {/* Resend Success Message */}
      {resendSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>Verification email sent successfully!</span>
        </motion.div>
      )}

      {/* Resend Error Message */}
      {resendError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {resendError}
        </motion.div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {onResend && (
          <Button
            onClick={handleResend}
            disabled={isResending || resendSuccess}
            variant="outline"
            className="w-full rounded-lg py-6"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Email Sent
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>
        )}

        <Button asChild variant="outline" className="w-full rounded-lg py-6">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
