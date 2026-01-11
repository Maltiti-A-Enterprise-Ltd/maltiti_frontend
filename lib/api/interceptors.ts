import { client } from '@/app/api/client.gen';
import { authenticationControllerRefreshToken } from '@/app/api';
import { store } from '@/lib/store/store';
import { clearUser } from '@/lib/store/features/auth/authSlice';
import type { ResolvedRequestOptions } from '@/app/api/client/types.gen';

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
// Queue of requests waiting for token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
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
      // Token refresh successful - new tokens are set in HTTP-only cookies by the backend
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
 * Recreate a Response object with the same properties but fresh body stream
 */
const recreateResponse = async (originalResponse: Response): Promise<Response> => {
  // Clone the response body before it's consumed
  const body = await originalResponse.clone().text();

  // Create a new Response with the same properties
  return new Response(body, {
    status: originalResponse.status,
    statusText: originalResponse.statusText,
    headers: originalResponse.headers,
  });
};

/**
 * Setup API client interceptors for token refresh
 */
export const setupInterceptors = (): void => {
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
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(async () => {
          // Retry the original request with a new token
          const method = (originalRequest.method || 'GET').toLowerCase() as Lowercase<
            NonNullable<typeof originalRequest.method>
          >;
          const clientMethod = client[method] as typeof client.get;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { method: _, ...requestOptions } = originalRequest;
          const retryResult = await clientMethod({
            ...requestOptions,
            _retry: true,
          } as Omit<ResolvedRequestOptions, 'method'>);
          // Return a fresh Response object to avoid body stream consumption issues
          return recreateResponse(retryResult.response);
        })
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

        // Retry the original request with new token
        const method = (originalRequest.method || 'GET').toLowerCase() as Lowercase<
          NonNullable<typeof originalRequest.method>
        >;
        const clientMethod = client[method] as typeof client.get;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { method: _, ...requestOptions } = originalRequest;
        const retryResult = await clientMethod(
          requestOptions as Omit<ResolvedRequestOptions, 'method'>,
        );
        // Return a fresh Response object to avoid body stream consumption issues
        return recreateResponse(retryResult.response);
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
