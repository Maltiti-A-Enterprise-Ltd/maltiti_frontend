'use client';

import { JSX, useState, lazy, Suspense, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, ShoppingBag, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/store/useCart';

// Lazy load components
const LocationForm = lazy(() => import('./location-form'));
const GuestLocationForm = lazy(() => import('./guest-location-form'));
const GuestAuthPrompt = lazy(() => import('./guest-auth-prompt'));
const OrderSummary = lazy(() => import('./order-summary'));

import {
  checkoutControllerInitializeTransaction,
  checkoutControllerGetDeliveryCost,
  checkoutControllerPlaceOrder,
  checkoutControllerGuestInitializeTransaction,
  checkoutControllerGuestPlaceOrder,
  checkoutControllerGetGuestDeliveryCost,
  customerControllerGetMyCustomer,
  InitializeTransaction,
  GetDeliveryCostDto,
  PlaceOrderDto,
  GuestInitializeTransactionDto,
  GuestPlaceOrderDto,
  CustomerResponseDto,
} from '@/app/api';
import { toast } from 'sonner';
import { getGuestSessionId } from '@/lib/session-utils';
import { GuestLocationFormValues } from '@/components/checkout/guest-location-form';

type LocationData = {
  country: string;
  region: string;
  city: string;
  phoneNumber: string;
  extraInfo?: string;
};

type GuestLocationData = GuestLocationFormValues;

const CheckoutPage = (): JSX.Element => {
  const router = useRouter();
  const { items, totalPrice, isLoading, isFetching, isAuthenticated } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [guestLocationData, setGuestLocationData] = useState<GuestLocationData | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [isInternationalDelivery, setIsInternationalDelivery] = useState(false);
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerResponseDto | null>(null);

  const checkoutButtonRef = useRef<HTMLButtonElement>(null);

  const isCartLoading = isLoading || isFetching;

  // Fetch customer data for logged-in users
  useEffect(() => {
    const fetchCustomerData = async (): Promise<void> => {
      if (!isAuthenticated) {
        return;
      }

      setIsLoadingCustomerData(true);
      try {
        const { data, error } = await customerControllerGetMyCustomer();

        if (error) {
          // Customer data not found - this is okay for first-time customers
          console.log('No existing customer data found');
          return;
        }

        if (data) {
          setCustomerData(data.data);
        }
      } catch (error) {
        // Silently handle errors - user can still fill in the form manually
        console.error('Error fetching customer data:', error);
      } finally {
        setIsLoadingCustomerData(false);
      }
    };

    void fetchCustomerData();
  }, [isAuthenticated]);

  const scrollToCheckout = (): void => {
    if (window.innerWidth < 1025 && checkoutButtonRef.current) {
      setTimeout(() => {
        checkoutButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  };

  const calculateDeliveryCost = async (location: LocationData): Promise<void> => {
    setIsCalculatingDelivery(true);
    setIsInternationalDelivery(false);
    setDeliveryError(null);

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

      // response.data is already DeliveryResponseDto
      if (typeof response.data.data !== 'number') {
        throw new Error('Invalid delivery cost response');
      }

      const cost = response.data.data;

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
      scrollToCheckout();
    } catch (error) {
      console.error('Delivery cost calculation error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to calculate delivery cost. Please try again.';
      setDeliveryError(errorMessage);
      toast.error('Delivery Calculation Failed', {
        description: errorMessage,
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

  const calculateGuestDeliveryCost = async (location: GuestLocationData): Promise<void> => {
    setIsCalculatingDelivery(true);
    setIsInternationalDelivery(false);
    setDeliveryError(null);

    try {
      const sessionId = getGuestSessionId();

      const response = await checkoutControllerGetGuestDeliveryCost({
        body: {
          sessionId,
          country: location.country,
          region: location.region,
          city: location.city,
        },
      });

      if (response.error || !response.data) {
        throw new Error('Unable to calculate delivery cost');
      }

      if (typeof response.data.data !== 'number') {
        throw new Error('Invalid delivery cost response');
      }

      const cost = response.data.data;

      if (cost === -1) {
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
      scrollToCheckout();
    } catch (error) {
      console.error('Delivery cost calculation error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to calculate delivery cost. Please try again.';
      setDeliveryError(errorMessage);
      toast.error('Delivery Calculation Failed', {
        description: errorMessage,
      });
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const handleGuestLocationSubmit = (data: GuestLocationData): void => {
    setGuestLocationData(data);
    void calculateGuestDeliveryCost(data);
  };

  const handleContinueAsGuest = (): void => {
    setShowGuestCheckout(true);
    if (window.innerWidth < 1025) {
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleCheckout = async (): Promise<void> => {
    // Validate location data based on user type
    if (isAuthenticated && !locationData) {
      toast.error('Location Required', {
        description: 'Please fill in your delivery location details.',
      });
      return;
    }

    if (!isAuthenticated && !guestLocationData) {
      toast.error('Information Required', {
        description: 'Please fill in your delivery information.',
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
      if (isAuthenticated && locationData) {
        // Authenticated user checkout flow
        if (isInternationalDelivery || deliveryCost === null) {
          const payload: PlaceOrderDto = {
            country: locationData.country,
            region: locationData.region,
            city: locationData.city,
            phoneNumber: locationData.phoneNumber,
            extraInfo: locationData.extraInfo,
          };

          const { data, error } = await checkoutControllerPlaceOrder({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to place order. Please try again.');
          }

          toast.success('Order Placed Successfully!', {
            description:
              'Your order has been placed. We will contact you with the delivery cost and you can make payment from your orders page.',
            duration: 8000,
          });

          setTimeout(() => {
            router.push('/track-order');
          }, 2000);
        } else {
          // Normal flow: proceed to payment
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

          if (paymentLink) {
            window.location.href = paymentLink;
          } else {
            throw new Error('Payment link not received');
          }
        }
      } else if (!isAuthenticated && guestLocationData) {
        // Guest checkout flow
        const sessionId = getGuestSessionId();

        if (isInternationalDelivery || deliveryCost === null) {
          const payload: GuestPlaceOrderDto = {
            email: guestLocationData.email,
            sessionId,
            country: guestLocationData.country,
            region: guestLocationData.region,
            city: guestLocationData.city,
            phoneNumber: guestLocationData.phoneNumber,
            extraInfo: guestLocationData.extraInfo,
            name: guestLocationData.name,
          };

          const { data, error } = await checkoutControllerGuestPlaceOrder({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to place order. Please try again.');
          }

          toast.success('Order Placed Successfully!', {
            description:
              'Your order has been placed. We will contact you via email with the delivery cost and payment instructions.',
            duration: 8000,
          });

          // Redirect to order tracking page
          setTimeout(() => {
            router.push(`/track-order/${data.data.id}`);
          }, 2000);
        } else {
          // Normal flow: proceed to payment
          const payload: GuestInitializeTransactionDto = {
            email: guestLocationData.email,
            sessionId,
            country: guestLocationData.country,
            region: guestLocationData.region,
            city: guestLocationData.city,
            phoneNumber: guestLocationData.phoneNumber,
            extraInfo: guestLocationData.extraInfo,
            name: guestLocationData.name,
          };

          const { data, error } = await checkoutControllerGuestInitializeTransaction({
            body: payload,
          });

          if (!data || error) {
            throw new Error('Unable to initialize payment. Please try again.');
          }

          const paymentLink = data.data.authorization_url;

          if (paymentLink) {
            window.location.href = paymentLink;
          } else {
            throw new Error('Payment link not received');
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(
        isInternationalDelivery ? 'Order Placement Failed' : 'Payment Initialization Failed',
        {
          description:
            error instanceof Error
              ? error.message
              : isInternationalDelivery
                ? 'Unable to place order. Please try again.'
                : 'Unable to initialize payment. Please try again.',
        },
      );
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
          <p className="mt-2 text-gray-600">Complete your order information</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Location Form or Auth Prompt */}
          <div className="space-y-6">
            {/* Show guest auth prompt if user is not authenticated and hasn't chosen guest checkout */}
            {!isAuthenticated && !showGuestCheckout ? (
              <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                <GuestAuthPrompt onContinueAsGuest={handleContinueAsGuest} />
              </Suspense>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isAuthenticated ? 'Delivery Information' : 'Guest Checkout'}
                    </CardTitle>
                    <CardDescription>
                      {isAuthenticated
                        ? 'Please provide your delivery location details'
                        : 'Complete your purchase without creating an account'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAuthenticated ? (
                      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                        <LocationForm
                          onSubmit={handleLocationSubmit}
                          onReset={() => setLocationData(null)}
                          initialData={
                            customerData
                              ? {
                                  country: customerData.country || '',
                                  region: customerData.region || '',
                                  city: customerData.city || '',
                                  phoneNumber: customerData.phoneNumber || customerData.phone || '',
                                  extraInfo: customerData.extraInfo || '',
                                }
                              : undefined
                          }
                          isLoading={isLoadingCustomerData}
                        />
                      </Suspense>
                    ) : (
                      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                        <GuestLocationForm
                          onSubmit={handleGuestLocationSubmit}
                          onReset={() => setGuestLocationData(null)}
                        />
                      </Suspense>
                    )}
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
                        Your payment information is encrypted and secure. We ship globally and
                        handle bulk export orders. We accept Mobile Money, Visa, and other payment
                        methods via Paystack.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
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
                {deliveryError && (locationData || guestLocationData) && (
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
                          onClick={() => {
                            if (isAuthenticated && locationData) {
                              calculateDeliveryCost(locationData);
                            } else if (!isAuthenticated && guestLocationData) {
                              calculateGuestDeliveryCost(guestLocationData);
                            }
                          }}
                          disabled={isCalculatingDelivery}
                          className="border-red-300 text-red-700 hover:bg-red-100"
                        >
                          {isCalculatingDelivery ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  ref={checkoutButtonRef}
                  onClick={handleCheckout}
                  disabled={
                    isProcessing ||
                    (!isAuthenticated && !showGuestCheckout) ||
                    (isAuthenticated && !locationData) ||
                    (!isAuthenticated && !guestLocationData) ||
                    isCalculatingDelivery ||
                    (deliveryError !== null && !isInternationalDelivery && deliveryCost === null)
                  }
                  className="w-full bg-[#0F6938] text-lg font-semibold hover:bg-[#0F6938]/90"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : isInternationalDelivery || deliveryCost === null ? (
                    <>Place Order</>
                  ) : (
                    <>Proceed to Payment</>
                  )}
                </Button>

                {(isInternationalDelivery || deliveryCost === null) &&
                  (showGuestCheckout || isAuthenticated) && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
