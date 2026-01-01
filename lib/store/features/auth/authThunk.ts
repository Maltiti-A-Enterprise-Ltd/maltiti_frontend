import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginFormData, SignupFormData } from '@/lib/validations/auth';
import {
  authenticationControllerCustomerSignup,
  authenticationControllerLogout,
  authenticationControllerSignIn,
} from '@/app/api';

/**
 * Login thunk
 * Authenticates user with credentials and returns user data
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const { data, error } = await authenticationControllerSignIn({ body: credentials });
      if (!data) {
        return rejectWithValue(error?.message || 'Login failed');
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
          userType: 'user',
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
 * Logout thunk
 * Clears authentication cookies and logs out the user
 */
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await authenticationControllerLogout();
    if (!data) {
      return rejectWithValue(error?.message || 'Login failed');
    }
    return null;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'error' in error) {
      const apiError = error as { error?: { message?: string } };
      return rejectWithValue(apiError.error?.message || 'Logout failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});
