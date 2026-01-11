'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/store/useCart';
import LocationForm from './location-form';
import OrderSummary from './order-summary';
import {
  checkoutControllerInitializeTransaction,
  checkoutControllerGetDeliveryCost,
  InitializeTransaction,
  GetDeliveryCostDto,
} from '@/app/api';
import { toast } from 'sonner';

type LocationData = {
  country: string;
  region: string;
  city: string;
  phoneNumber: string;
  extraInfo?: string;
};

const CheckoutPage = (): JSX.Element => {
  const router = useRouter();
  const { items, totalPrice, isLoading, isFetching } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [isInternationalDelivery, setIsInternationalDelivery] = useState(false);

  const isCartLoading = isLoading || isFetching;

  const calculateDeliveryCost = async (location: LocationData): Promise<void> => {
    setIsCalculatingDelivery(true);
    setIsInternationalDelivery(false);

    try {
      const payload: GetDeliveryCostDto = {
        country: location.country,
        region: location.region,
        city: location.city,
      };

      const response = await checkoutControllerGetDeliveryCost({
        body: payload,
      });

      if (response.error || !response.data) {
        throw new Error('Unable to calculate delivery cost');
      }

      // Cast to the expected type after error check
      const responseData = response.data;

      if (typeof responseData.data !== 'number') {
        throw new Error('Invalid delivery cost response');
      }

      const cost = responseData.data;

      if (cost === -1) {
        // International delivery - cost will be determined later
        setIsInternationalDelivery(true);
        setDeliveryCost(null);
        toast.info('International Delivery', {
          description:
            'We will contact you regarding delivery costs for international orders. Please proceed to complete your order.',
          duration: 6000,
        });
      } else {
        setDeliveryCost(cost);
        setIsInternationalDelivery(false);
      }
    } catch (error) {
      console.error('Delivery cost calculation error:', error);
      toast.error('Delivery Calculation Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'Unable to calculate delivery cost. Please try again.',
      });
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const handleLocationSubmit = (data: LocationData): void => {
    setLocationData(data);
    // Calculate delivery cost when location is submitted
    calculateDeliveryCost(data);
  };

  const handleProceedToPayment = async (): Promise<void> => {
    if (!locationData) {
      toast.error('Location Required', {
        description: 'Please fill in your delivery location details.',
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Empty Cart', {
        description: 'Your cart is empty. Please add items to checkout.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const payload: InitializeTransaction = {
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        phoneNumber: locationData.phoneNumber,
        extraInfo: locationData.extraInfo,
      };

      const { data, error } = await checkoutControllerInitializeTransaction({
        body: payload,
      });

      if (!data || error) {
        throw new Error('Unable to initialize payment. Please try again.');
      }

      const paymentLink = data.data.authorization_url;

      // Redirect to Paystack
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        throw new Error('Payment link not received');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Payment Initialization Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'Unable to initialize payment. Please try again.',
      });
      setIsProcessing(false);
    }
  };

  // Show loading state while cart is being fetched
  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="mb-4 h-10 w-20" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="mt-2 h-6 w-96" />
          </div>

          {/* Main Content Skeleton */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-2 h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="mt-2 h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <Separator />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 rounded-full bg-gray-100 p-6">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="mb-6 text-gray-600">Add some products to get started with checkout</p>
              <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 gap-2 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order and proceed to payment</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Location Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
                <CardDescription>Please provide your delivery location details</CardDescription>
              </CardHeader>
              <CardContent>
                <LocationForm onSubmit={handleLocationSubmit} />
              </CardContent>
            </Card>

            {/* Trust Badge */}
            <Card className="bg-green-50/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Lock className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Worldwide Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We ship globally and handle
                    bulk export orders. We accept Mobile Money, Visa, and other payment methods via
                    Paystack.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{items.length} items in your cart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <OrderSummary
                  items={items}
                  totalPrice={totalPrice}
                  deliveryCost={deliveryCost}
                  isCalculatingDelivery={isCalculatingDelivery}
                  isInternationalDelivery={isInternationalDelivery}
                />

                <Separator />

                <Button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing || !locationData}
                  className="w-full bg-[#0F6938] text-lg font-semibold hover:bg-[#0F6938]/90"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>Proceed to Payment</>
                  )}
                </Button>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
