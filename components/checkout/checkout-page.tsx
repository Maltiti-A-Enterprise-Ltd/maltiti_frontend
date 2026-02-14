'use client';

import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/lib/hooks/useCheckout';
import {
  CheckoutHeader,
  CheckoutLoadingSkeleton,
  EmptyCart,
  DeliverySection,
  OrderSummarySection,
} from '@/components/checkout';

const CheckoutPage = (): JSX.Element => {
  const router = useRouter();
  const {
    // State
    isCartLoading,
    isProcessing,
    locationData,
    guestLocationData,
    deliveryCost,
    isCalculatingDelivery,
    isInternationalDelivery,
    showGuestCheckout,
    deliveryError,
    isLoadingCustomerData,
    customerData,
    items,
    totalPrice,
    isAuthenticated,

    // Handlers
    handleLocationSubmit,
    handleGuestLocationSubmit,
    handleContinueAsGuest,
    handleCheckout,
    handleResetLocation,
    handleResetGuestLocation,
    handleRetryDelivery,
  } = useCheckout();

  // Show loading state while cart is being fetched
  if (isCartLoading) {
    return <CheckoutLoadingSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCart onContinueShopping={() => router.push('/shop')} />;
  }

  const getButtonContent = (): JSX.Element => {
    if (isProcessing) {
      return (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Processing...
        </>
      );
    }

    if (isInternationalDelivery || deliveryCost === null) {
      return <>Place Order</>;
    }

    return <>Proceed to Payment</>;
  };

  const buttonContent = getButtonContent();

  const showInternationalNote =
    (isInternationalDelivery || deliveryCost === null) && (showGuestCheckout || isAuthenticated);

  const buttonDisabled =
    isProcessing ||
    (!isAuthenticated && !showGuestCheckout) ||
    (isAuthenticated && !locationData) ||
    (!isAuthenticated && !guestLocationData) ||
    isCalculatingDelivery ||
    (deliveryError !== null && !isInternationalDelivery && deliveryCost === null);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <CheckoutHeader
          onBack={() => router.back()}
          title="Checkout"
          description="Complete your order information"
        />

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Delivery Section */}
          <DeliverySection
            isAuthenticated={isAuthenticated}
            showGuestCheckout={showGuestCheckout}
            onContinueAsGuest={handleContinueAsGuest}
            onLocationSubmit={handleLocationSubmit}
            onGuestLocationSubmit={handleGuestLocationSubmit}
            onResetLocation={handleResetLocation}
            onResetGuestLocation={handleResetGuestLocation}
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
            isLoadingCustomerData={isLoadingCustomerData}
          />

          {/* Right Column: Order Summary Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <OrderSummarySection
              items={items}
              totalPrice={totalPrice}
              deliveryCost={deliveryCost}
              isCalculatingDelivery={isCalculatingDelivery}
              isInternationalDelivery={isInternationalDelivery}
              deliveryError={deliveryError}
              onRetryDelivery={handleRetryDelivery}
              isProcessing={isProcessing}
              buttonDisabled={buttonDisabled}
              onCheckout={handleCheckout}
              buttonContent={buttonContent}
              showInternationalNote={showInternationalNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
