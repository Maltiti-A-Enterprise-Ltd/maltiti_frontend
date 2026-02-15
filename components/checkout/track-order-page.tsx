'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewModal } from '@/components/reviews';
import { useTrackOrder } from './track-order/use-track-order';
import { OrderDetailsCard } from './track-order/order-details-card';
import { DeliveryInfoCard } from './track-order/delivery-info-card';
import { OrderStatusCard } from './track-order/order-status-card';
import { EmailRequestCard } from './track-order/email-request-card';
import { CancelOrderDialog } from './track-order/cancel-order-dialog';
import { LoadingState } from './track-order/loading-state';
import { ErrorState } from './track-order/error-state';
import { TrackOrderPageProps } from './track-order/types';

const TrackOrderPage = ({ saleId, email: initialEmail }: TrackOrderPageProps): JSX.Element => {
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    isLoading,
    orderDetails,
    error,
    email,
    setEmail,
    needsEmail,
    isConfirmingDelivery,
    isInitializingPayment,
    isCancellingOrder,
    fetchOrderStatus,
    confirmDelivery,
    handlePayNow,
    handleCancelOrder,
    triedUserEmail,
    getCancellationStatusMessage,
    getCancellationDialogMessage,
  } = useTrackOrder(saleId, initialEmail);

  const handleConfirmDelivery = async (): Promise<void> => {
    await confirmDelivery();
    setTimeout(() => {
      setShowReviewModal(true);
    }, 1000);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (needsEmail) {
    return (
      <EmailRequestCard
        email={email}
        setEmail={setEmail}
        onTrack={() => void fetchOrderStatus()}
        triedUserEmail={triedUserEmail}
      />
    );
  }

  if (error || !orderDetails) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="mt-16 min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop')}
            className="mb-4 gap-2 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-gray-600">Order ID: {saleId}</p>
        </div>

        <OrderStatusCard
          orderDetails={orderDetails}
          isInitializingPayment={isInitializingPayment}
          onPayNow={() => void handlePayNow()}
          isConfirmingDelivery={isConfirmingDelivery}
          onConfirmDelivery={() => void handleConfirmDelivery()}
          onWriteReview={() => setShowReviewModal(true)}
          onCancelClick={() => setShowCancelDialog(true)}
          cancellationMessage={getCancellationStatusMessage()}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <OrderDetailsCard orderDetails={orderDetails} />
          <DeliveryInfoCard orderDetails={orderDetails} />
        </div>

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          saleId={saleId}
        />

        <CancelOrderDialog
          isOpen={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          onCancel={handleCancelOrder}
          isLoading={isCancellingOrder}
          dialogMessage={getCancellationDialogMessage()}
        />
      </div>
    </div>
  );
};

export default TrackOrderPage;
