'use client';

import { JSX, lazy, Suspense } from 'react';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LocationForm = lazy(() => import('./location-form'));
const GuestLocationForm = lazy(() => import('./guest-location-form'));
const GuestAuthPrompt = lazy(() => import('./guest-auth-prompt'));

import { LocationData, GuestLocationData } from '@/lib/hooks/useCheckout';

type DeliverySectionProps = {
  isAuthenticated: boolean;
  showGuestCheckout: boolean;
  onContinueAsGuest: () => void;
  onLocationSubmit: (data: LocationData) => void;
  onGuestLocationSubmit: (data: GuestLocationData) => void;
  onResetLocation: () => void;
  onResetGuestLocation: () => void;
  initialData?: Partial<LocationData>;
  isLoadingCustomerData: boolean;
};

const DeliverySection = ({
  isAuthenticated,
  showGuestCheckout,
  onContinueAsGuest,
  onLocationSubmit,
  onGuestLocationSubmit,
  onResetLocation,
  onResetGuestLocation,
  initialData,
  isLoadingCustomerData,
}: DeliverySectionProps): JSX.Element => (
  <div className="space-y-6">
    {/* Show guest auth prompt if user is not authenticated and hasn't chosen guest checkout */}
    {!isAuthenticated && !showGuestCheckout ? (
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <GuestAuthPrompt onContinueAsGuest={onContinueAsGuest} />
      </Suspense>
    ) : (
      <>
        <Card>
          <CardHeader>
            <CardTitle>{isAuthenticated ? 'Delivery Information' : 'Guest Checkout'}</CardTitle>
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
                  onSubmit={onLocationSubmit}
                  onReset={onResetLocation}
                  initialData={initialData}
                  isLoading={isLoadingCustomerData}
                />
              </Suspense>
            ) : (
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <GuestLocationForm
                  onSubmit={onGuestLocationSubmit}
                  onReset={onResetGuestLocation}
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
                Your payment information is encrypted and secure. We ship globally and handle bulk
                export orders. We accept Mobile Money, Visa, and other payment methods via Paystack.
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    )}
  </div>
);

export default DeliverySection;
