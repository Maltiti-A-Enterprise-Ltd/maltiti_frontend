'use client';

import React, { JSX, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations/settings';
import { authenticationControllerChangePassword } from '@/app/api/sdk.gen';
import { useAppSelector } from '@/lib/store/hooks';
import { selectUser } from '@/lib/store/features/auth';
import { toast } from 'sonner';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export function ChangePasswordForm(): JSX.Element {
  const user = useAppSelector(selectUser);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(null);
      return;
    }

    let strength = 0;

    // Length check
    if (newPassword.length >= 8) {
      strength++;
    }
    if (newPassword.length >= 12) {
      strength++;
    }

    // Character type checks
    if (/[a-z]/.test(newPassword)) {
      strength++;
    }
    if (/[A-Z]/.test(newPassword)) {
      strength++;
    }
    if (/[0-9]/.test(newPassword)) {
      strength++;
    }
    if (/[^A-Za-z0-9]/.test(newPassword)) {
      strength++;
    }

    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [newPassword]);

  const onSubmit = async (data: ChangePasswordFormData): Promise<void> => {
    if (!user?.id) {
      toast.error('Authentication error', {
        description: 'Please log in again to change your password.',
      });
      return;
    }

    try {
      await authenticationControllerChangePassword({
        path: { id: user.id },
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      });

      // Clear form
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Reset password visibility
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast.success('Password changed successfully', {
        description: 'Please use your new password next time you log in.',
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    } catch (error: unknown) {
      console.error('Failed to change password:', error);

      let errorMessage = 'Failed to change password. Please try again.';

      if (error && typeof error === 'object' && 'message' in error) {
        const msg = String(error.message).toLowerCase();
        if (msg.includes('incorrect') || msg.includes('invalid') || msg.includes('current')) {
          errorMessage = 'Current password is incorrect. Please try again.';
        } else if (msg.includes('weak')) {
          errorMessage = 'New password does not meet security requirements.';
        } else if (msg.includes('unauthorized') || msg.includes('token')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else {
          errorMessage = String(error.message);
        }
      }

      toast.error('Password change failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const getStrengthColor = (): string => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  };

  const getStrengthWidth = (): string => {
    switch (passwordStrength) {
      case 'weak':
        return 'w-1/3';
      case 'medium':
        return 'w-2/3';
      case 'strong':
        return 'w-full';
      default:
        return 'w-0';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure. Choose a strong password you don&apos;t
          use anywhere else.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Current Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
                disabled={isSubmitting}
                {...register('currentPassword')}
                className={
                  errors.currentPassword
                    ? 'border-destructive focus-visible:ring-destructive pr-10'
                    : 'pr-10'
                }
                aria-invalid={errors.currentPassword ? 'true' : 'false'}
                aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="current-password-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.currentPassword.message}
              </motion.p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                disabled={isSubmitting}
                {...register('newPassword')}
                className={
                  errors.newPassword
                    ? 'border-destructive focus-visible:ring-destructive pr-10'
                    : 'pr-10'
                }
                aria-invalid={errors.newPassword ? 'true' : 'false'}
                aria-describedby={
                  errors.newPassword
                    ? 'new-password-error'
                    : passwordStrength
                      ? 'password-strength'
                      : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <AnimatePresence>
              {newPassword && !errors.newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                  id="password-strength"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: passwordStrength ? '100%' : '0%' }}
                        className={`h-full transition-colors ${getStrengthColor()} ${getStrengthWidth()}`}
                      />
                    </div>
                    <span className="text-muted-foreground text-xs font-medium capitalize">
                      {passwordStrength}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.newPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="new-password-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.newPassword.message}
              </motion.p>
            )}

            {/* Password Requirements */}
            <div className="text-muted-foreground space-y-1 pt-1 text-xs">
              <p className="font-medium">Password must contain:</p>
              <ul className="list-inside list-disc space-y-0.5 pl-2">
                <li>At least 8 characters</li>
                <li>One uppercase letter (A-Z)</li>
                <li>One lowercase letter (a-z)</li>
                <li>One number (0-9)</li>
                <li>One special character (!@#$%^&*)</li>
              </ul>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confirm New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                disabled={isSubmitting}
                {...register('confirmPassword')}
                className={
                  errors.confirmPassword
                    ? 'border-destructive focus-visible:ring-destructive pr-10'
                    : 'pr-10'
                }
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="confirm-password-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                reset({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
