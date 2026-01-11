'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { checkoutControllerConfirmPayment } from '@/app/api';

type ConfirmPaymentPageProps = {
  checkoutId: string;
};

type PaymentStatus = 'loading' | 'success' | 'error';

const ConfirmPaymentPage = ({ checkoutId }: ConfirmPaymentPageProps): JSX.Element => {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const confirmPayment = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    if (!checkoutId) {
      setStatus('error');
      setErrorMessage('Invalid checkout ID. Please contact support.');
      return;
    }

    try {
      const { error } = await checkoutControllerConfirmPayment({
        path: { checkoutId },
      });

      if (error) {
        throw new Error(
          String((error as { message: string }).message || 'Payment confirmation failed.'),
        );
      }

      setStatus('success');

      setTimeout(() => {
        router.push('/orders');
      }, 3000);
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to confirm payment. Please contact support.',
      );
    }
  }, [checkoutId, router]);

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
                <Button
                  onClick={() => router.push('/orders')}
                  className="w-full bg-[#0F6938] hover:bg-[#0F6938]/90"
                >
                  View My Orders
                </Button>
                <Button onClick={() => router.push('/shop')} variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">Redirecting to orders page...</p>
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
