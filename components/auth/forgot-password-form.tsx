'use client';

import React, { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { authenticationControllerForgotPassword } from '@/app/api';

export function ForgotPasswordForm(): JSX.Element {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    try {
      setServerError('');

      // Call the forgot password API
      await authenticationControllerForgotPassword({
        body: {
          email: data.email,
        },
      });

      // Successfully sent email
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      // Handle errors
      if (error && typeof error === 'object' && 'message' in error) {
        setServerError(error.message as string);
      } else {
        setServerError('Failed to send password reset email. Please try again.');
      }
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Check Your Email</h3>
          <p className="text-gray-600">We&apos;ve sent a password reset link to:</p>
          <p className="font-semibold text-green-600">{submittedEmail}</p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium">What to do next:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-left">
            <li>Check your inbox (and spam folder)</li>
            <li>Click the reset link in the email</li>
            <li>The link will expire in 1 hour</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Resend Email
          </Button>

          <Link href="/auth/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Info Message */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800"
      >
        <p className="font-medium">Don&apos;t worry, it happens!</p>
        <p className="mt-1">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </motion.div>

      {/* Server Error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-red-50 p-4 text-sm text-red-600"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            disabled={isSubmitting}
            autoComplete="email"
            className="pl-10"
          />
          <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
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
            Sending Reset Link...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-5 w-5" />
            Send Reset Link
          </>
        )}
      </Button>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </form>
  );
}
