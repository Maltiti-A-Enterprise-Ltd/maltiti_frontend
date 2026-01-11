'use client';

import React, { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resendVerificationSchema, type ResendVerificationFormData } from '@/lib/validations/auth';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { resendVerificationEmail } from '@/lib/store/features/auth/authThunk';
import {
  selectResendVerificationLoading,
  selectResendVerificationError,
} from '@/lib/store/features/auth/authSelectors';

export function ResendVerificationForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectResendVerificationLoading);
  const serverError = useAppSelector(selectResendVerificationError);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    mode: 'onChange',
  });

  const submittedEmail = watch('email');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const onSubmit = async (data: ResendVerificationFormData): Promise<void> => {
    const result = await dispatch(resendVerificationEmail(data)).unwrap();
    if (result) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Email Sent!</h3>
          <p className="text-gray-600">
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-gray-900">{submittedEmail}</span>
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Mail className="h-8 w-8 text-green-600" />
      </div>

      {/* Description */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a new verification link.
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-4 text-sm text-red-600"
        >
          {serverError}
        </motion.div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full rounded-lg py-6 text-base font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Resend Verification Email'
        )}
      </Button>

      {/* Back Link */}
      <p className="text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-700">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
