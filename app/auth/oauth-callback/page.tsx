'use client';

import { JSX, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateAccessToken, setUser } from '@/lib/store/features/auth/authSlice';
import { profileControllerGetProfile, StatusEnum } from '@/app/api';

export default function OAuthCallbackPage(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      router.replace(
        '/auth/oauth-error?message=' + encodeURIComponent('No access token received from Google.'),
      );
      return;
    }

    const handleCallback = async (): Promise<void> => {
      try {
        // Store access token first so the interceptor attaches it to the profile request
        dispatch(updateAccessToken(accessToken));

        const { data } = await profileControllerGetProfile();

        if (data) {
          dispatch(
            setUser({
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              userType: data.data.userType,
              phoneNumber: data.data.phone,
              avatarUrl: data.data.avatarUrl,
              mustChangePassword: false,
              status: StatusEnum.ACTIVE,
              createdAt: data.data.createdAt,
              emailVerifiedAt: data.data.emailVerifiedAt,
              updatedAt: data.data.updatedAt,
            }),
          );
        }

        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl');
          router.replace(returnUrl);
        } else {
          router.replace('/');
        }
      } catch {
        router.replace(
          '/auth/oauth-error?message=' +
            encodeURIComponent('Failed to complete Google sign in. Please try again.'),
        );
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-200" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-700">Completing sign in...</p>
        <p className="mt-1 text-sm text-gray-500">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
