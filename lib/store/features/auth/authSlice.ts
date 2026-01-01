import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UserResponseDto } from '@/app/api';
import { login, logout, signup } from '@/lib/store/features/auth/authThunk';

// User type based on UserResponseDto from the API
interface AuthPageState<T> {
  login: T;
  signup: T;
  logout: T;
}

interface AuthState {
  user: UserResponseDto | null;
  isLoading: AuthPageState<boolean>;
  error: AuthPageState<string | null>;
}

const initialState: AuthState = {
  user: null,
  isLoading: {
    login: false,
    signup: false,
    logout: false,
  },
  error: {
    login: null,
    signup: null,
    logout: null,
  },
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserResponseDto>) => {
      state.user = action.payload;
      state.error = {
        login: null,
        signup: null,
        logout: null,
      };
    },
    clearUser: (state) => {
      state.user = null;
      state.error = {
        login: null,
        signup: null,
        logout: null,
      };
    },
    clearError: (state, action: PayloadAction<'login' | 'signup' | 'logout' | undefined>) => {
      if (action.payload) {
        state.error[action.payload] = null;
      } else {
        state.error = {
          login: null,
          signup: null,
          logout: null,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading.login = true;
        state.error.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading.login = false;
        state.user = action.payload;
        state.error.login = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading.login = false;
        state.error.login = action.payload as string;
        state.user = null;
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading.signup = true;
        state.error.signup = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading.signup = false;
        state.error.signup = null;
        // Don't set user on signup, wait for email verification and login
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading.signup = false;
        state.error.signup = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading.logout = true;
        state.error.logout = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading.logout = false;
        state.user = null;
        state.error.logout = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading.logout = false;
        state.error.logout = action.payload as string;
        // Still clear user even if logout API fails
        state.user = null;
      });
  },
});

// Actions
export const { setUser, clearUser, clearError } = authSlice.actions;

// Reducer
export default authSlice.reducer;
