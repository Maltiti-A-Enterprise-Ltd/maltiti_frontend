import { z } from 'zod';

/**
 * Signup validation schema
 * Validates email, name, password, and confirmPassword fields
 */
export const signupSchema = z
  .object({
    email: z.email('Please enter a valid email address').min(1, 'Email is required'),
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Login validation schema
 * Validates email and password fields
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Resend verification email schema
 */
export const resendVerificationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

// Type inference from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;
