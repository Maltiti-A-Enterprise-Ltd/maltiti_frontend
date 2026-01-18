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
import { getGuestSessionId, hasGuestSession, clearGuestSessionId } from '@/lib/session-utils';
import { getErrorMessage } from '@/lib/utils';

/**
 * Login thunk
 * Authenticates user with credentials and returns user data
 * Automatically syncs guest cart if sessionId exists (backend handles the sync)
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      // Get guest session ID if it exists
      const sessionId = hasGuestSession() ? getGuestSessionId() : undefined;

      const { data, error } = await authenticationControllerSignIn({
        body: {
          ...credentials,
          sessionId, // Backend will sync guest cart if sessionId is provided
        },
      });

      if (!data) {
        return rejectWithValue(error?.message || 'Login failed');
      }

      // Clear guest session ID after successful login
      // Backend has already synced the cart
      if (sessionId) {
        clearGuestSessionId();
      }

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
        return rejectWithValue(getErrorMessage(error, 'Something went wrong during signup'));
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
 * Logs the user in automatically upon successful verification
 * Backend automatically syncs guest cart if sessionId is provided
 */
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      // Get guest session ID if it exists
      const sessionId = hasGuestSession() ? getGuestSessionId() : '';

      const { error, data } = await authenticationControllerEmailVerification({
        path: { id, token },
        query: { sessionId }, // Backend will sync guest cart if sessionId is provided
      });

      if (error || !data) {
        return rejectWithValue(error?.message || 'Email verification failed');
      }

      // Clear guest session ID after successful verification
      // Backend has already synced the cart
      if (sessionId) {
        clearGuestSessionId();
      }

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
