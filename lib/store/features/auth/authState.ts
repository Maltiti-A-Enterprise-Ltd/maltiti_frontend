// User type based on UserResponseDto from the API
import { UserResponseDto } from '@/app/api';

interface AuthPageState<T> {
  login: T;
  signup: T;
  logout: T;
  resendVerification: T;
  verifyEmail: T;
}

export interface AuthState {
  user: UserResponseDto | null;
  isLoading: AuthPageState<boolean>;
  error: AuthPageState<string | null>;
}
