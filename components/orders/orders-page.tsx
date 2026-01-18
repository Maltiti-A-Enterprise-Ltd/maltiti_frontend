'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { checkoutControllerGetOrders, type CheckoutDto } from '@/app/api';
import { toast } from 'sonner';

const OrdersPage = (): JSX.Element => {
  const router = useRouter();
  const [orders, setOrders] = useState<CheckoutDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        const { data, error } = await checkoutControllerGetOrders();

        if (error || !data) {
          throw new Error('Failed to load orders');
        }

        setOrders(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to Load Orders', {
          description: 'Unable to fetch your orders. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status.toLowerCase()) {
      case 'invoice_requested':
      case 'pending_payment':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'packaging':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'invoice_requested':
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'packaging':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'invoice_requested':
        return 'Invoice Requested';
      case 'pending_payment':
        return 'Pending Payment';
      case 'paid':
        return 'Paid';
      case 'packaging':
        return 'Packaging';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentStatusIcon = (status: string): JSX.Element => {
    switch (status.toLowerCase()) {
      case 'invoice_requested':
        return <Clock className="h-4 w-4" />;
      case 'pending_payment':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'refunded':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'invoice_requested':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'invoice_requested':
        return 'Invoice Requested';
      case 'pending_payment':
        return 'Pending Payment';
      case 'paid':
        return 'Paid';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Skeleton className="mb-4 h-10 w-20" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="mt-2 h-6 w-96" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-6xl">
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
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 rounded-full bg-gray-100 p-6">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">No orders yet</h2>
              <p className="mb-6 text-gray-600">Start shopping to see your orders here</p>
              <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <CardHeader className="bg-gray-50/50">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Badge
                        className={`${getStatusColor(order.sale.orderStatus)} flex w-fit items-center gap-1 border`}
                      >
                        {getStatusIcon(order.sale.orderStatus)}
                        {getStatusText(order.sale.orderStatus)}
                      </Badge>
                      <Badge
                        className={`${getPaymentStatusColor(order.sale.paymentStatus)} flex w-fit items-center gap-1 border`}
                      >
                        {getPaymentStatusIcon(order.sale.paymentStatus)}
                        {getPaymentStatusText(order.sale.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Order Info */}
                  <div className="space-y-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Order Total</p>
                          <p className="text-2xl font-bold text-[#0F6938]">
                            GH₵ {Number(order.amount).toFixed(2)}
                          </p>
                        </div>
                        {order.sale.lineItems && order.sale.lineItems.length > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Items</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {order.sale.lineItems.length}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Show payment reference if available */}
                    {order.paystackReference && (
                      <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-xs text-gray-500">Payment Reference</p>
                        <p className="font-mono text-sm text-gray-900">{order.paystackReference}</p>
                      </div>
                    )}

                    {/* Status-specific messages */}
                    {order.sale.paymentStatus.toLowerCase() === 'invoice_requested' && (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <p className="text-sm text-orange-800">
                          We are calculating your delivery cost. You will be contacted shortly to
                          complete payment.
                        </p>
                      </div>
                    )}
                    {order.sale.paymentStatus.toLowerCase() === 'pending_payment' && (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                        <p className="text-sm text-yellow-800">
                          Please complete your payment to proceed with this order.
                        </p>
                      </div>
                    )}
                    {order.sale.paymentStatus.toLowerCase() === 'refunded' && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-800">
                          This order has been refunded. Please contact support if you have any
                          questions.
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {(order.sale.paymentStatus.toLowerCase() === 'pending_payment' ||
                      order.sale.paymentStatus.toLowerCase() === 'invoice_requested') && (
                      <Button
                        onClick={() => {
                          // TODO: Implement payment logic when ready
                          toast.info('Payment', {
                            description: 'Payment feature will be available soon.',
                          });
                        }}
                        className="flex-1 bg-[#0F6938] hover:bg-[#0F6938]/90"
                      >
                        Make Payment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
