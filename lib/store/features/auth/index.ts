// Export slice, actions, selectors, and thunks
export {
  default as authReducer,
  setUser,
  clearUser,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserName,
  selectUserEmail,
} from './authSlice';

// Export thunks
export { login, signup, logout } from './authThunk';
