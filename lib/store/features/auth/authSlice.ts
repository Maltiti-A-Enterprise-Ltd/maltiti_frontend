import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UserResponseDto } from '@/app/api';
import { login, logout, signup } from '@/lib/store/features/auth/authThunk';

// User type based on UserResponseDto from the API

interface AuthState {
  user: UserResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserResponseDto>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Don't set user on signup, wait for email verification and login
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still clear user even if logout API fails
        state.user = null;
      });
  },
});

// Actions
export const { setUser, clearUser, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }): UserResponseDto | null => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => !!state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }): boolean => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }): string | null => state.auth.error;
export const selectUserName = (state: { auth: AuthState }): string | undefined =>
  state.auth.user?.name;
export const selectUserEmail = (state: { auth: AuthState }): string | undefined =>
  state.auth.user?.email;

// Reducer
export default authSlice.reducer;
