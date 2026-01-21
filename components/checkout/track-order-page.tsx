'use client';

import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { OrderStatus, PaymentStatus, SaleResponseDto, salesControllerTrackOrder } from '@/app/api';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/lib/store/features/auth';

type TrackOrderPageProps = {
  saleId: string;
  email?: string;
};

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: JSX.Element;
    description: string;
  }
> = {
  [OrderStatus.PENDING]: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: <Clock className="h-5 w-5" />,
    description: 'Your order is being reviewed',
  },
  [OrderStatus.PACKAGING]: {
    label: 'Processing',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <Package className="h-5 w-5" />,
    description: 'Your order is being prepared',
  },
  [OrderStatus.IN_TRANSIT]: {
    label: 'Shipped',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: <Truck className="h-5 w-5" />,
    description: 'Your order is on its way',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Delivered',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Your order has been delivered',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <XCircle className="h-5 w-5" />,
    description: 'This order was cancelled',
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: JSX.Element;
    description: string;
  }
> = {
  [PaymentStatus.INVOICE_REQUESTED]: {
    label: 'Invoice Requested',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <Clock className="h-5 w-5" />,
    description: 'Invoice has been requested',
  },
  [PaymentStatus.PENDING_PAYMENT]: {
    label: 'Payment Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: <Clock className="h-5 w-5" />,
    description: 'Payment is pending',
  },
  [PaymentStatus.PAID]: {
    label: 'Paid',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Payment has been completed',
  },
  [PaymentStatus.REFUNDED]: {
    label: 'Refunded',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: <XCircle className="h-5 w-5" />,
    description: 'Payment has been refunded',
  },
};

const TrackOrderPage = ({ saleId, email: initialEmail }: TrackOrderPageProps): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<SaleResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(initialEmail || '');
  const [needsEmail, setNeedsEmail] = useState(!initialEmail);
  const [triedUserEmail, setTriedUserEmail] = useState(false);

  // Get user authentication state
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const subTotal = useMemo(
    () =>
      orderDetails?.lineItems
        .map((item) => item.finalPrice * item.requestedQuantity)
        .reduce((acc, curr) => acc + curr, 0) ?? 0,
    [orderDetails],
  );

  const deliveryFee = useMemo(
    () => Number(orderDetails?.checkout?.amount) - subTotal,
    [subTotal, orderDetails?.checkout?.amount],
  );

  const fetchOrderStatus = useCallback(async (): Promise<void> => {
    console.log('No email', email);
    if (!email) {
      setNeedsEmail(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await salesControllerTrackOrder({
        path: { saleId },
        query: { email },
      });

      if (error || !data) {
        throw new Error('Unable to fetch order details');
      }

      setOrderDetails(data.data);
      setNeedsEmail(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order details');
      toast.error('Error', {
        description: 'Unable to load order details. Please check your order ID.',
      });
      // If we tried the user's email and it failed, show email input
      if (isAuthenticated && user?.email && email === user.email && !triedUserEmail) {
        setTriedUserEmail(true);
        setNeedsEmail(true);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [saleId, email, isAuthenticated, user, triedUserEmail]);

  useEffect(() => {
    if (saleId && !initialEmail && isAuthenticated && user?.email && !triedUserEmail) {
      // Try with user's email first
      setEmail(user.email);
      setTriedUserEmail(true);
      void fetchOrderStatus();
    } else if (saleId && initialEmail) {
      // If email is provided in props, use it directly
      void fetchOrderStatus();
    } else if (saleId && !isAuthenticated) {
      // If not authenticated and no email, show email input
      setNeedsEmail(true);
      setIsLoading(false);
    }
  }, [saleId, initialEmail, isAuthenticated, user, triedUserEmail, fetchOrderStatus]);

  if (isLoading) {
    return (
      <div className="mt-16 flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-green-50/30">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-green-600" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (needsEmail) {
    return (
      <div className="mt-16 min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card className={triedUserEmail ? 'border-amber-200 bg-amber-50/50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {triedUserEmail && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                Track Your Order
              </CardTitle>
              <CardDescription className={triedUserEmail ? 'text-amber-800' : ''}>
                {triedUserEmail
                  ? "We couldn't find this order with your account email. Please try another email address."
                  : 'Enter your email to view order details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the email address you used during checkout
                </p>
              </div>
              <Button
                onClick={() => {
                  void fetchOrderStatus();
                }}
                disabled={!email}
                className="w-full bg-[#0F6938] hover:bg-[#0F6938]/90"
              >
                Track Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="mt-16 min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="border-red-200">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 rounded-full bg-red-100 p-6">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Order Not Found</h2>
              <p className="mb-6 text-gray-600">
                {error || 'We couldn&apos;t find an order with this ID.'}
              </p>
              <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[orderDetails.orderStatus];
  const paymentStatusInfo = paymentStatusConfig[orderDetails.paymentStatus];
  const formattedDate = new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mb-6 border-2 border-green-100">
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Order Status */}
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
                    <p className="text-sm leading-relaxed text-gray-600">
                      {statusInfo.description}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Information about your purchase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Date</p>
                    <p className="text-sm text-gray-600">{formattedDate}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Items Ordered</h3>
                  {orderDetails.lineItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName} x{item.requestedQuantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        GHS {(item.finalPrice * item.requestedQuantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">GHS {subTotal.toFixed(2)}</span>
                  </div>
                  {orderDetails.checkout?.amount !== null ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-medium text-gray-900">
                        GHS {deliveryFee.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span className="text-xs text-blue-600">To be determined</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      {orderDetails.checkout?.amount
                        ? `GHS ${Number(orderDetails.checkout.amount).toFixed(2)}`
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
                <CardDescription>Where your order will be sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{orderDetails.customer.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Number</p>
                    <p className="text-sm text-gray-600">{orderDetails.customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                    <p className="text-sm text-gray-600">
                      {orderDetails.customer.city}, {orderDetails.customer.region}
                      <br />
                      {orderDetails.customer.country}
                      {orderDetails.customer.extraInfo && (
                        <>
                          <br />
                          {orderDetails.customer.extraInfo}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="mt-6 bg-blue-50/50">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold text-gray-900">Need Help?</h3>
                <p className="mb-4 text-sm text-gray-600">
                  If you have any questions about your order, please contact our support team.
                </p>
                <Button variant="outline" className="w-full" onClick={() => router.push('/shop')}>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
