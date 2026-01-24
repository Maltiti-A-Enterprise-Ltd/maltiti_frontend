import { client } from '@/app/api/client.gen';
import { authenticationControllerRefreshToken } from '@/app/api';
import { store } from '@/lib/store/store';
import { clearUser, updateAccessToken } from '@/lib/store/features/auth/authSlice';
import type { ResolvedRequestOptions } from '@/app/api/client/types.gen';

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
// Queue of requests waiting for token refresh
let failedQueue: Array<{
  resolve: (value: Response) => void;
  reject: (reason?: unknown) => void;
  response: Response;
}> = [];

const processQueue = (error: Error | null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(promise.response);
    }
  });
  failedQueue = [];
};

/**
 * Check if the request URL is an auth endpoint
 * We don't want to refresh token for auth endpoints
 */
const isAuthEndpoint = (url: string): boolean => {
  const authEndpoints = [
    '/authentication/login',
    '/authentication/sign-in',
    '/authentication/signup',
    '/authentication/customer-signup',
    '/authentication/register',
    '/authentication/refresh-token',
    '/authentication/logout',
    '/authentication/forgot-password',
    '/authentication/reset-password',
    '/authentication/verify',
    '/authentication/resend-verification',
  ];

  return authEndpoints.some((endpoint) => url.includes(endpoint));
};

/**
 * Attempt to refresh the access token
 */
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await authenticationControllerRefreshToken();

    if (data) {
      // Update the access token in the store
      store.dispatch(updateAccessToken(data));
      return true;
    }

    if (error) {
      console.error('Token refresh failed:', error);
      return false;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

/**
 * Handle session expiry by clearing user data and redirecting to login
 */
const handleSessionExpiry = (): void => {
  // Clear user from store
  store.dispatch(clearUser());

  // Store current URL to redirect back after login
  const currentPath = window.location.pathname + window.location.search;

  // Don't save auth pages as return URL
  const authPages = ['/auth/login', '/auth/signup', '/auth/verify', '/auth/resend-verification'];
  const shouldSaveReturnUrl = !authPages.some((page) => currentPath.startsWith(page));

  if (shouldSaveReturnUrl && currentPath !== '/') {
    sessionStorage.setItem('returnUrl', currentPath);
  }

  // Show toast notification
  const event = new CustomEvent('session-expired', {
    detail: { message: 'Your session has expired. Please login again to continue.' },
  });
  window.dispatchEvent(event);

  // Redirect to login page
  window.location.href = '/auth/login';
};

/**
 * Setup API client interceptors for token refresh
 */
export const setupInterceptors = (): void => {
  // Request interceptor to add Authorization header
  client.interceptors.request.use((options: ResolvedRequestOptions) => {
    const accessToken = store.getState().auth.accessToken;
    console.log('Request interceptor called for URL:', options.url);
    console.log('Access token:', accessToken ? 'present' : 'null');

    // Add Authorization header if token exists and not an auth endpoint
    if (accessToken && !isAuthEndpoint(options.url || '')) {
      console.log('Adding Authorization header');
      if (!options.headers) {
        options.headers = new Headers();
      }
      if (options.headers instanceof Headers) {
        options.headers.set('Authorization', `Bearer ${accessToken}`);
      } else if (typeof options.headers === 'object') {
        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
      }
    } else {
      console.log('Not adding Authorization header - token missing or auth endpoint');
    }
  });

  // Response interceptor to handle 401 errors
  client.interceptors.response.use(async (response: Response, options: ResolvedRequestOptions) => {
    const originalRequest = options;

    // If response is not 401 or is an auth endpoint, return response as-is
    if (response.status !== 401 || isAuthEndpoint(originalRequest.url || '')) {
      return response;
    }

    // If already tried to refresh, don't try again (prevent infinite loop)
    if (originalRequest._retry) {
      handleSessionExpiry();
      return response;
    }

    // If currently refreshing, queue this request
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({ resolve, reject, response });
      })
        .then(
          () =>
            // Do not retry the request - return the 401 response as is
            response,
        )
        .catch((err) => {
          throw err;
        });
    }

    // Mark as retrying and attempt to refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshSuccess = await refreshAccessToken();

      if (refreshSuccess) {
        // Token refreshed successfully, process queued requests
        processQueue(null);
        isRefreshing = false;

        // Do not retry the original request - return the 401 response as is
        return response;
      }
      // Token refresh failed, clear queue and handle session expiry
      processQueue(new Error('Token refresh failed'));
      isRefreshing = false;
      handleSessionExpiry();
      return response;
    } catch (error) {
      // Token refresh error, clear queue and handle session expiry
      processQueue(error instanceof Error ? error : new Error('Token refresh failed'));
      isRefreshing = false;
      handleSessionExpiry();
      return response;
    }
  });
};

// Type augmentation to add _retry a flag to request options
declare module '@/app/api/client/types.gen' {
  interface ResolvedRequestOptions {
    _retry?: boolean;
  }
}
