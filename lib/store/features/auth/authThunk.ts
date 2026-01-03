import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  LoginFormData,
  ResendVerificationFormData,
  SignupFormData,
} from '@/lib/validations/auth';
import {
  authenticationControllerCustomerSignup,
  authenticationControllerEmailVerification,
  authenticationControllerLogout,
  authenticationControllerResendVerificationEmail,
  authenticationControllerSignIn,
  Role,
} from '@/app/api';

/**
 * Login thunk
 * Authenticates user with credentials and returns user data
 * After successful login, triggers guest cart sync if applicable
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue, dispatch }) => {
    try {
      const { data, error } = await authenticationControllerSignIn({ body: credentials });
      if (!data) {
        return rejectWithValue(error?.message || 'Login failed');
      }

      // Import syncGuestCart dynamically to avoid circular dependency
      const { syncGuestCart } = await import('../cart/cartThunk');

      // Trigger guest cart sync after successful login
      // This will merge any items in the guest cart with the user's server cart
      dispatch(syncGuestCart());

      return data.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Signup thunk
 * Registers a new customer account
 * Note: Does not log the user in - email verification required
 */
export const signup = createAsyncThunk(
  'auth/signup',
  async (body: SignupFormData, { rejectWithValue }) => {
    try {
      const { error, data } = await authenticationControllerCustomerSignup({
        body: {
          ...body,
          userType: Role.USER,
        },
      });
      if (!data) {
        return rejectWithValue(error?.message || 'Login failed');
      }
      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Signup failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Resend verification email thunk
 * Sends a new verification email to the user's email address
 */
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (body: ResendVerificationFormData, { rejectWithValue }) => {
    try {
      const { error, data } = await authenticationControllerResendVerificationEmail({
        body,
      });
      if (!data) {
        return rejectWithValue(error?.message || 'Failed to resend verification email');
      }
      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to resend verification email');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Verify email thunk
 * Verifies user email using the verification token from email
 * Now logs the user in automatically upon successful verification
 * Also triggers guest cart sync after successful verification
 */
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue, dispatch }) => {
    try {
      const { error, data } = await authenticationControllerEmailVerification({
        path: { id, token },
      });
      if (error || !data) {
        return rejectWithValue(error?.message || 'Email verification failed');
      }

      // Import syncGuestCart dynamically to avoid circular dependency
      const { syncGuestCart } = await import('../cart/cartThunk');

      // Trigger guest cart sync after successful verification and login
      dispatch(syncGuestCart());

      // Return the user data from the response
      return data.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Email verification failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Logout thunk
 * Clears authentication cookies and logs out the user
 * Also resets the cart state
 */
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
  try {
    const { data, error } = await authenticationControllerLogout();
    if (!data) {
      return rejectWithValue(error?.message || 'Login failed');
    }

    // Import resetCart dynamically to avoid circular dependency
    const { resetCart } = await import('../cart/cartSlice');

    // Clear cart state on logout
    dispatch(resetCart());

    return null;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'error' in error) {
      const apiError = error as { error?: { message?: string } };
      return rejectWithValue(apiError.error?.message || 'Logout failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});
