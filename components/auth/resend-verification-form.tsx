'use client';

import React, { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resendVerificationSchema, type ResendVerificationFormData } from '@/lib/validations/auth';
import { authenticationControllerRegister } from '@/app/api/sdk.gen';

interface ResendVerificationFormProps {
  onSuccess?: (email: string) => void;
}

export function ResendVerificationForm({ onSuccess }: ResendVerificationFormProps): JSX.Element {
  const [serverError, setServerError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResendVerificationFormData): Promise<void> => {
    try {
      setServerError('');
      // Note: Using register endpoint as a workaround since there's no dedicated resend endpoint
      // In production, you should have a dedicated resend verification endpoint
      await authenticationControllerRegister({
        body: { email: data.email },
      });

      setSubmittedEmail(data.email);
      setIsSuccess(true);

      if (onSuccess) {
        onSuccess(data.email);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        setServerError(apiError.error?.message || 'Failed to resend verification email.');
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
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
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full rounded-lg py-6 text-base font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
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
