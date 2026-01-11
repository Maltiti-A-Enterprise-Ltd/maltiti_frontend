// Export slice and actions
export { default as authReducer, setUser, clearUser, clearError } from './authSlice';

// Export thunks
export { login, signup, logout } from './authThunk';

// Export selectors
export {
  // User selectors
  selectUser,
  selectIsAuthenticated,
  selectUserName,
  selectUserEmail,
  // Loading state selectors
  selectAuthLoading,
  selectLoginLoading,
  selectSignupLoading,
  selectLogoutLoading,
  selectIsAnyAuthLoading,
  // Error state selectors
  selectAuthError,
  selectLoginError,
  selectSignupError,
  selectLogoutError,
  selectHasAnyAuthError,
} from './authSelectors';
