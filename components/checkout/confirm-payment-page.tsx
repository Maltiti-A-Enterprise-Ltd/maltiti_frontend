'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { checkoutControllerConfirmPayment, checkoutControllerConfirmGuestPayment } from '@/app/api';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated } from '@/lib/store/features/auth';

type ConfirmPaymentPageProps = {
  checkoutId: string;
};

type PaymentStatus = 'loading' | 'success' | 'error';

const ConfirmPaymentPage = ({ checkoutId }: ConfirmPaymentPageProps): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');

  const confirmPayment = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    if (!checkoutId) {
      setStatus('error');
      setErrorMessage('Invalid checkout ID. Please contact support.');
      return;
    }

    try {
      // Determine if this is a guest or authenticated user payment
      if (isAuthenticated) {
        // Authenticated user - use regular confirm payment endpoint
        const { error } = await checkoutControllerConfirmPayment({
          path: { checkoutId },
        });

        if (error) {
          throw new Error(
            String((error as { message: string }).message || 'Payment confirmation failed.'),
          );
        }

        setStatus('success');

        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          router.push('/orders');
        }, 3000);
      } else {
        // Guest user - use guest confirm payment endpoint
        const { error, data } = await checkoutControllerConfirmGuestPayment({
          path: { checkoutId },
        });

        if (error || !data) {
          throw new Error(
            String((error as { message: string }).message || 'Payment confirmation failed.'),
          );
        }

        setStatus('success');

        // Extract email from response or search params for redirect
        const email = searchParams.get('email') || '';
        setGuestEmail(email);

        // Redirect to track order page after 3 seconds
        setTimeout(() => {
          const trackUrl = email
            ? `/track-order/${checkoutId}?email=${encodeURIComponent(email)}`
            : `/track-order/${checkoutId}`;
          router.push(trackUrl);
        }, 3000);
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to confirm payment. Please contact support.',
      );
    }
  }, [checkoutId, router, isAuthenticated, searchParams]);

  useEffect(() => {
    void confirmPayment();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          {status === 'loading' && (
            <>
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <Loader2 className="text-primary h-12 w-12 animate-spin" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Confirming Payment</h2>
              <p className="text-gray-600">Please wait while we verify your payment...</p>
              <div className="mt-6 space-y-2">
                <div className="h-2 w-64 animate-pulse rounded-full bg-gray-200" />
                <div className="h-2 w-48 animate-pulse rounded-full bg-gray-200" />
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="animate-in fade-in zoom-in mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 duration-300">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Confirmed!</h2>
              <p className="mb-6 text-gray-600">
                Your order has been successfully placed. You will receive a confirmation email
                shortly.
              </p>
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => router.push('/orders')}
                      className="w-full bg-[#0F6938] hover:bg-[#0F6938]/90"
                    >
                      View My Orders
                    </Button>
                    <Button
                      onClick={() => router.push('/shop')}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">Redirecting to orders page...</p>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        const trackUrl = guestEmail
                          ? `/track-order/${checkoutId}?email=${encodeURIComponent(guestEmail)}`
                          : `/track-order/${checkoutId}`;
                        router.push(trackUrl);
                      }}
                      className="w-full bg-[#0F6938] hover:bg-[#0F6938]/90"
                    >
                      Track My Order
                    </Button>
                    <Button
                      onClick={() => router.push('/shop')}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                      Redirecting to order tracking page...
                    </p>
                  </>
                )}
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="animate-in fade-in zoom-in mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 duration-300">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Confirmation Failed</h2>
              <p className="mb-6 text-gray-600">{errorMessage}</p>
              <div className="space-y-3">
                <Button
                  onClick={confirmPayment}
                  className="w-full bg-[#0F6938] hover:bg-[#0F6938]/90"
                >
                  Try Again
                </Button>
                <Button onClick={() => router.push('/shop')} variant="outline" className="w-full">
                  Back to Shop
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                If you believe this is an error, please contact our support team with checkout ID:{' '}
                <span className="font-mono font-semibold">{checkoutId}</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmPaymentPage;
