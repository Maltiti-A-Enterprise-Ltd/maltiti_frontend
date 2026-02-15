'use client';

import { JSX, lazy, Ref, Suspense } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CartItemDto } from '@/app/api';

const OrderSummary = lazy(() => import('./order-summary'));

type OrderSummarySectionProps = {
  items: CartItemDto[];
  totalPrice: number;
  deliveryCost: number | null;
  isCalculatingDelivery: boolean;
  isInternationalDelivery: boolean;
  deliveryError: string | null;
  onRetryDelivery: () => void;
  isProcessing: boolean;
  buttonDisabled: boolean;
  onCheckout: () => void;
  buttonContent: JSX.Element;
  showInternationalNote: boolean;
  buttonRef: Ref<HTMLButtonElement | null>;
};

const OrderSummarySection = ({
  items,
  totalPrice,
  deliveryCost,
  isCalculatingDelivery,
  isInternationalDelivery,
  deliveryError,
  onRetryDelivery,
  buttonDisabled,
  buttonRef,
  onCheckout,
  buttonContent,
  showInternationalNote,
}: OrderSummarySectionProps): JSX.Element => (
  <Card>
    <CardHeader>
      <CardTitle>Order Summary</CardTitle>
      <CardDescription>{items.length} items in your cart</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <Suspense
        fallback={
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        }
      >
        <OrderSummary
          items={items}
          totalPrice={totalPrice}
          deliveryCost={deliveryCost}
          isCalculatingDelivery={isCalculatingDelivery}
          isInternationalDelivery={isInternationalDelivery}
        />
      </Suspense>

      <Separator />

      {/* Delivery Error with Retry Option */}
      {deliveryError && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">
                  Failed to calculate delivery cost
                </p>
                <p className="mt-1 text-xs text-red-700">{deliveryError}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRetryDelivery}
                disabled={isCalculatingDelivery}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isCalculatingDelivery ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        ref={buttonRef}
        onClick={onCheckout}
        disabled={buttonDisabled}
        className="w-full bg-[#0F6938] text-lg font-semibold hover:bg-[#0F6938]/90"
        size="lg"
      >
        {buttonContent}
      </Button>

      {showInternationalNote && (
        <p className="text-center text-xs text-blue-600">
          You will be able to make payment once we confirm the delivery cost
        </p>
      )}

      <p className="text-center text-xs text-gray-500">
        By proceeding, you agree to our{' '}
        <a href="/terms" className="underline hover:text-gray-700">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </a>
      </p>
    </CardContent>
  </Card>
);

export default OrderSummarySection;
