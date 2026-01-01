'use client';

import React, { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectAuthLoading, selectAuthError } from '@/lib/store/features/auth/authSlice';
import { login } from '@/lib/store/features/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [showPassword, setShowPassword] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsUnverified(false);

      // Dispatch login action
      await dispatch(login(data)).unwrap();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to home page
      router.push('/');
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string' ? error : 'Invalid email or password.';

      // Check if error is related to unverified email
      if (
        errorMessage.toLowerCase().includes('verify') ||
        errorMessage.toLowerCase().includes('verification')
      ) {
        setIsUnverified(true);
      }
    }
  };

  const displayError = authError || '';
  const isLoading = isSubmitting || isAuthLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Server Error */}
      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 text-sm ${
            isUnverified ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-600'
          }`}
        >
          {isUnverified
            ? 'Your email is not verified. Please check your email for the verification link.'
            : displayError}
          {isUnverified && (
            <Link
              href="/auth/resend-verification"
              className="mt-2 block font-medium underline hover:no-underline"
            >
              Resend verification email
            </Link>
          )}
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

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            disabled={isSubmitting}
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
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
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-700">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
