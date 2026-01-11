import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UserResponseDto } from '@/app/api';
import {
  login,
  logout,
  signup,
  resendVerificationEmail,
  verifyEmail,
} from '@/lib/store/features/auth/authThunk';
import { AuthState } from '@/lib/store/features/auth/authState';

const initialState: AuthState = {
  user: null,
  isLoading: {
    login: false,
    signup: false,
    logout: false,
    resendVerification: false,
    verifyEmail: false,
  },
  error: {
    login: null,
    signup: null,
    logout: null,
    resendVerification: null,
    verifyEmail: null,
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
        resendVerification: null,
        verifyEmail: null,
      };
    },
    updateUser: (state, action: PayloadAction<Partial<UserResponseDto>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.error = {
        login: null,
        signup: null,
        logout: null,
        resendVerification: null,
        verifyEmail: null,
      };
    },
    clearError: (
      state,
      action: PayloadAction<
        'login' | 'signup' | 'logout' | 'resendVerification' | 'verifyEmail' | undefined
      >,
    ) => {
      if (action.payload) {
        state.error[action.payload] = null;
      } else {
        state.error = {
          login: null,
          signup: null,
          logout: null,
          resendVerification: null,
          verifyEmail: null,
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

    // Resend Verification Email
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading.resendVerification = true;
        state.error.resendVerification = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isLoading.resendVerification = false;
        state.error.resendVerification = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading.resendVerification = false;
        state.error.resendVerification = action.payload as string;
      });

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading.verifyEmail = true;
        state.error.verifyEmail = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading.verifyEmail = false;
        state.user = action.payload; // Set user data like login does
        state.error.verifyEmail = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading.verifyEmail = false;
        state.error.verifyEmail = action.payload as string;
        state.user = null;
      });
  },
});

// Actions
export const { setUser, clearUser, clearError, updateUser } = authSlice.actions;

// Reducer
export default authSlice.reducer;
