'use client';

import React, { JSX, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { authenticationControllerResetPassword } from '@/app/api';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps): JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      token,
    },
  });

  const password = watch('password');

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) {
      strength += 25;
    }
    if (password.length >= 12) {
      strength += 15;
    }
    if (/[A-Z]/.test(password)) {
      strength += 20;
    }
    if (/[a-z]/.test(password)) {
      strength += 15;
    }
    if (/[0-9]/.test(password)) {
      strength += 15;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 10;
    }

    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  const getPasswordStrengthColor = (): string => {
    if (passwordStrength < 40) {
      return 'bg-red-500';
    }
    if (passwordStrength < 70) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (): string => {
    if (passwordStrength < 40) {
      return 'Weak';
    }
    if (passwordStrength < 70) {
      return 'Medium';
    }
    return 'Strong';
  };

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    try {
      setServerError('');

      // Call the reset password API
      await authenticationControllerResetPassword({
        body: {
          token: data.token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      });

      // Successfully reset password
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: unknown) {
      // Handle errors
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;

        // Check for specific error types
        if (errorMessage.toLowerCase().includes('expired')) {
          setServerError('This reset link has expired. Please request a new password reset link.');
        } else if (errorMessage.toLowerCase().includes('invalid')) {
          setServerError('This reset link is invalid. Please request a new password reset link.');
        } else {
          setServerError(errorMessage);
        }
      } else {
        setServerError('Failed to reset password. Please try again.');
      }
    }
  };

  // Success state
  if (isSuccess) {
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
          <h3 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h3>
          <p className="text-gray-600">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <p>Redirecting you to the login page...</p>
        </div>

        <Link href="/auth/login">
          <Button className="w-full">Go to Login</Button>
        </Link>
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
        <p className="font-medium">Create your new password</p>
        <p className="mt-1">Please enter a strong password that you haven&apos;t used before.</p>
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
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p>{serverError}</p>
                {(serverError.toLowerCase().includes('expired') ||
                  serverError.toLowerCase().includes('invalid')) && (
                  <Link
                    href="/auth/forgot-password"
                    className="mt-2 inline-block font-medium underline hover:no-underline"
                  >
                    Request new reset link
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            disabled={isSubmitting}
            autoComplete="new-password"
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

        {/* Password Strength Indicator */}
        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1"
          >
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className={`h-full ${getPasswordStrengthColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-600">
              Password strength: <span className="font-medium">{getPasswordStrengthText()}</span>
            </p>
          </motion.div>
        )}

        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            disabled={isSubmitting}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
        <p className="mb-2 font-medium">Password must contain:</p>
        <ul className="space-y-1">
          <li className={password?.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</li>
          <li className={/[A-Z]/.test(password || '') ? 'text-green-600' : ''}>
            • One uppercase letter
          </li>
          <li className={/[a-z]/.test(password || '') ? 'text-green-600' : ''}>
            • One lowercase letter
          </li>
          <li className={/[0-9]/.test(password || '') ? 'text-green-600' : ''}>• One number</li>
          <li className={/[^A-Za-z0-9]/.test(password || '') ? 'text-green-600' : ''}>
            • One special character
          </li>
        </ul>
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
            Resetting Password...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>

      {/* Back to Login Link */}
      <p className="text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-700">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
