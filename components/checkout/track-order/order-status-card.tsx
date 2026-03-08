import { JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle, Package } from 'lucide-react';
import { OrderStatus, PaymentStatus, SaleResponseDto } from '@/app/api';
import { statusConfig, paymentStatusConfig } from './constants';
import { OrderProgressStepper } from './order-progress-stepper';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { REFUND_TIMELINE } from '@/lib/constants/refund-config';

type OrderStatusCardProps = {
  orderDetails: SaleResponseDto;
  isInitializingPayment: boolean;
  onPayNow: () => void;
  isConfirmingDelivery: boolean;
  onConfirmDelivery: () => void;
  onWriteReview: () => void;
  onCancelClick: () => void;
  cancellationMessage: string;
};

export const OrderStatusCard = ({
  orderDetails,
  isInitializingPayment,
  onPayNow,
  isConfirmingDelivery,
  onConfirmDelivery,
  onWriteReview,
  onCancelClick,
  cancellationMessage,
}: OrderStatusCardProps): JSX.Element => {
  const statusInfo = statusConfig[orderDetails.orderStatus];
  const paymentStatusInfo = paymentStatusConfig[orderDetails.paymentStatus];
  const isCancelled = orderDetails.orderStatus === OrderStatus.CANCELLED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mb-6 border-2 border-green-100">
        <CardContent className="p-8">
          <div className="space-y-6">
            {isCancelled ? (
              <div className="flex items-start gap-4">
                <div className={`rounded-full ${statusInfo.bgColor} shrink-0 p-3`}>
                  <div className={statusInfo.color}>{statusInfo.icon}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                    <Badge
                      variant="outline"
                      className={`${statusInfo.color} ${statusInfo.bgColor} text-xs font-medium`}
                    >
                      {orderDetails.orderStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{statusInfo.description}</p>
                  <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50/50 p-2.5 text-xs font-medium text-blue-700">
                    <Icon icon="ph:info" className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Refunds are processed automatically and take {REFUND_TIMELINE} to reflect in
                      your account.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <OrderProgressStepper currentStatus={orderDetails.orderStatus} />
            )}

            {/* Payment status */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full ${paymentStatusInfo.bgColor} shrink-0 p-3`}>
                <div className={paymentStatusInfo.color}>{paymentStatusInfo.icon}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
                  <Badge
                    variant="outline"
                    className={`${paymentStatusInfo.color} ${paymentStatusInfo.bgColor} text-xs font-medium`}
                  >
                    {orderDetails.paymentStatus.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {paymentStatusInfo.description}
                </p>
                {orderDetails.paymentStatus === PaymentStatus.PENDING_PAYMENT && (
                  <Button
                    onClick={onPayNow}
                    disabled={isInitializingPayment}
                    className="mt-3 rounded-md bg-green-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-700"
                  >
                    {isInitializingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Initializing Payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Pay Now
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Delivery Confirmation Section */}
            {orderDetails.orderStatus === OrderStatus.DELIVERED &&
              !orderDetails.confirmedDeliveryDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/50 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-full bg-amber-100 p-3">
                      <Package className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Confirm Your Delivery
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-600">
                        Great news! Your order has been delivered. Please confirm that you&#39;ve
                        received your items in good condition. This helps us ensure the best service
                        for all our customers.
                      </p>
                      <Button
                        onClick={onConfirmDelivery}
                        disabled={isConfirmingDelivery}
                        className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-700"
                      >
                        {isConfirmingDelivery ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Delivery
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

            {/* Delivery Confirmed Section */}
            {orderDetails.orderStatus === OrderStatus.DELIVERED &&
              !!orderDetails.confirmedDeliveryDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="rounded-lg border-2 border-green-200 bg-green-50/50 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Delivery Confirmed
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-600">
                        Thank you for confirming your delivery! We&apos;re glad your order arrived
                        safely. Your feedback helps us improve our service.
                        <br />
                        <span className="text-xs font-medium text-green-700">
                          Confirmed on:{' '}
                          {orderDetails.confirmedDeliveryDate
                            ? new Date(orderDetails.confirmedDeliveryDate).toLocaleString()
                            : ''}
                        </span>
                      </p>
                      <Button
                        onClick={onWriteReview}
                        variant="outline"
                        className="border-green-600 text-green-700 hover:bg-green-50"
                      >
                        <Icon icon="ph:star" className="mr-2 h-4 w-4" />
                        Write a Review
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

            {/* Cancel Order Action */}
            {!isCancelled &&
              (orderDetails.orderStatus === OrderStatus.PENDING ||
                orderDetails.orderStatus === OrderStatus.PACKAGING) && (
                <div className="flex flex-col gap-4 rounded-lg border border-red-100 bg-red-50/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cancel Order</p>
                      <p className="text-xs text-gray-600">{cancellationMessage}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancelClick}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
