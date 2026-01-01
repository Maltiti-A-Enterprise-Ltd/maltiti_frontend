import { UserResponseDto } from '@/app/api';

interface AuthState {
  user: UserResponseDto | null;
  isLoading: {
    login: boolean;
    signup: boolean;
    logout: boolean;
  };
  error: {
    login: string | null;
    signup: string | null;
    logout: string | null;
  };
}

// Root state type for selectors
type RootState = { auth: AuthState };

// ============================================================================
// User Selectors
// ============================================================================

export const selectUser = (state: RootState): UserResponseDto | null => state.auth.user;

export const selectIsAuthenticated = (state: RootState): boolean => !!state.auth.user;

export const selectUserName = (state: RootState): string | undefined => state.auth.user?.name;

export const selectUserEmail = (state: RootState): string | undefined => state.auth.user?.email;

// ============================================================================
// Loading State Selectors
// ============================================================================

// Get all loading states
export const selectAuthLoading = (state: RootState): AuthState['isLoading'] => state.auth.isLoading;

// Login loading state
export const selectLoginLoading = (state: RootState): boolean => state.auth.isLoading.login;

// Signup loading state
export const selectSignupLoading = (state: RootState): boolean => state.auth.isLoading.signup;

// Logout loading state
export const selectLogoutLoading = (state: RootState): boolean => state.auth.isLoading.logout;

// Check if any auth operation is loading
export const selectIsAnyAuthLoading = (state: RootState): boolean =>
  state.auth.isLoading.login || state.auth.isLoading.signup || state.auth.isLoading.logout;

// ============================================================================
// Error State Selectors
// ============================================================================

// Get all error states
export const selectAuthError = (state: RootState): AuthState['error'] => state.auth.error;

// Login error
export const selectLoginError = (state: RootState): string | null => state.auth.error.login;

// Signup error
export const selectSignupError = (state: RootState): string | null => state.auth.error.signup;

// Logout error
export const selectLogoutError = (state: RootState): string | null => state.auth.error.logout;

// Check if any auth operation has an error
export const selectHasAnyAuthError = (state: RootState): boolean =>
  !!state.auth.error.login || !!state.auth.error.signup || !!state.auth.error.logout;
