'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  Search,
  PackageSearch,
  AlertCircle,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  OrderStatus,
  PaymentStatus,
  SaleResponseDto,
  salesControllerListSalesByEmail,
  SalesControllerListSalesByEmailData,
} from '@/app/api';
import { toast } from 'sonner';
import { ShopPagination } from '@/components/shop';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type TrackOrderListingPageProps = Record<string, never>;

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: JSX.Element;
  }
> = {
  [OrderStatus.PENDING]: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: <Clock className="h-4 w-4" />,
  },
  [OrderStatus.PACKAGING]: {
    label: 'Processing',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <Package className="h-4 w-4" />,
  },
  [OrderStatus.IN_TRANSIT]: {
    label: 'Shipped',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: <Truck className="h-4 w-4" />,
  },
  [OrderStatus.DELIVERED]: {
    label: 'Delivered',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <XCircle className="h-4 w-4" />,
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  [PaymentStatus.INVOICE_REQUESTED]: {
    label: 'Invoice Requested',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [PaymentStatus.PENDING_PAYMENT]: {
    label: 'Payment Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  [PaymentStatus.PAID]: {
    label: 'Paid',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  [PaymentStatus.REFUNDED]: {
    label: 'Refunded',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
};

export default function TrackOrderListingPage({}: TrackOrderListingPageProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email');

  const [email, setEmail] = useState(emailFromQuery || '');
  const [searchEmail, setSearchEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<SaleResponseDto[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<
    Pick<SalesControllerListSalesByEmailData['query'], 'paymentStatus' | 'orderStatus'>
  >({
    orderStatus: (searchParams.get('status') as OrderStatus) || undefined,
    paymentStatus: (searchParams.get('paymentStatus') as PaymentStatus) || undefined,
  });

  const fetchOrders = useCallback(
    async (emailToSearch: string, page: number = 1): Promise<void> => {
      if (!emailToSearch) {
        toast.error('Please enter an email address');
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const { data, error } = await salesControllerListSalesByEmail({
          query: {
            email: emailToSearch,
            page,
            limit: 10,
            orderStatus: filters.orderStatus,
            paymentStatus: filters.paymentStatus,
          },
        });

        if (error || !data) {
          console.error('Error fetching orders:', error);
          toast.error('Error', {
            description: 'Unable to load orders. Please try again.',
          });
          setOrders([]);
          setTotalPages(1);
          setTotalItems(0);
          return;
        }

        // The response is always paginated
        setOrders(data.data.items);
        setCurrentPage(data.data.currentPage || page);
        setTotalPages(data.data.totalPages || 1);
        setTotalItems(data.data.totalItems || data.data.items.length);

        if (data.data.items.length === 0) {
          toast.info('No orders found', {
            description: `No orders found for ${emailToSearch}`,
          });
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Error', {
          description: 'Unable to load orders. Please try again.',
        });
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    if (emailFromQuery) {
      void fetchOrders(emailFromQuery);
    }
  }, [emailFromQuery, fetchOrders]);

  const handleSearch = (): void => {
    if (!searchEmail) {
      toast.error('Please enter an email address');
      return;
    }
    setEmail(searchEmail);
    router.push(`/track-order?email=${encodeURIComponent(searchEmail)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewOrder = (saleId: string): void => {
    router.push(`/track-order/${saleId}?email=${encodeURIComponent(email)}`);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage < 1 || newPage > totalPages || isLoading) {
      return;
    }
    setCurrentPage(newPage);
    void fetchOrders(email, newPage);
    // Scroll to top of orders list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-16 min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4 gap-2 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-bold text-gray-900">Track Your Orders</h1>
            <p className="mt-2 text-gray-600">View and track all your orders in one place</p>
          </motion.div>
        </div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="mb-8 border-2 border-green-100">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="search-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <Input
                    id="search-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={searchEmail || email}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading || (!searchEmail && !email)}
                    className="h-12 w-full gap-2 bg-[#0F6938] hover:bg-[#0F6938]/90 sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Search Orders
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter Section */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="mb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-gray-900">{totalItems}</span> order
                  {totalItems !== 1 ? 's' : ''} for <span className="font-medium">{email}</span>
                </p>
                {totalPages > 1 && (
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <Label className="mb-2" htmlFor="status">
                    Order Status
                  </Label>
                  <Select
                    value={filters.orderStatus || 'all'}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        orderStatus: value === 'all' ? undefined : (value as OrderStatus),
                      })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={OrderStatus.PACKAGING}>Processing</SelectItem>
                      <SelectItem value={OrderStatus.IN_TRANSIT}>Shipped</SelectItem>
                      <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                      <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2" htmlFor="paymentStatus">
                    Payment Status
                  </Label>
                  <Select
                    value={filters.paymentStatus || 'all'}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        paymentStatus: value === 'all' ? undefined : (value as PaymentStatus),
                      })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All payment statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All payment statuses</SelectItem>
                      <SelectItem value={PaymentStatus.INVOICE_REQUESTED}>
                        Invoice Requested
                      </SelectItem>
                      <SelectItem value={PaymentStatus.PENDING_PAYMENT}>Payment Pending</SelectItem>
                      <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                      <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    // update URL
                    const params = new URLSearchParams(searchParams.toString());
                    if (filters.orderStatus) {
                      params.set('status', filters.orderStatus);
                    } else {
                      params.delete('status');
                    }
                    if (filters.paymentStatus) {
                      params.set('paymentStatus', filters.paymentStatus);
                    } else {
                      params.delete('paymentStatus');
                    }
                    router.push(`/track-order?${params.toString()}`);
                  }}
                >
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-green-600" />
              <p className="text-gray-600">Searching for your orders...</p>
            </div>
          </motion.div>
        )}

        {/* Empty State - No Search Yet */}
        {!isLoading && !hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 rounded-full bg-green-100 p-6">
                  <PackageSearch className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Start Tracking</h2>
                <p className="mb-6 max-w-md text-gray-600">
                  Enter your email address above to view all orders associated with your account
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State - No Orders Found */}
        {!isLoading && hasSearched && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 rounded-full bg-yellow-100 p-6">
                  <AlertCircle className="h-16 w-16 text-yellow-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">No Orders Found</h2>
                <p className="mb-6 max-w-md text-gray-600">
                  We couldn&apos;t find any orders associated with{' '}
                  <span className="font-medium">{email}</span>
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={() => router.push('/shop')}
                    className="bg-[#0F6938] hover:bg-[#0F6938]/90"
                  >
                    Start Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchEmail('');
                      setEmail('');
                      setHasSearched(false);
                    }}
                  >
                    Try Another Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.orderStatus];
              const paymentInfo = paymentStatusConfig[order.paymentStatus];
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="group cursor-pointer transition-all hover:border-green-200 hover:shadow-lg"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left Section - Order Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className={`rounded-full ${statusInfo.bgColor} shrink-0 p-2`}>
                              <div className={statusInfo.color}>{statusInfo.icon}</div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Order ID</p>
                              <p className="font-mono text-sm font-semibold text-gray-900">
                                {order.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={`${statusInfo.color} ${statusInfo.bgColor} text-xs font-medium`}
                            >
                              {order.orderStatus.replace('_', ' ')}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${paymentInfo.color} ${paymentInfo.bgColor} text-xs font-medium`}
                            >
                              {order.paymentStatus.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Ordered on {formattedDate}</span>
                          </div>

                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">
                              {order.lineItems.length}
                            </span>{' '}
                            item{order.lineItems.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Right Section - Price and Action */}
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <div className="flex-1 sm:flex-none">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-green-600">
                              {order.checkout?.amount
                                ? `GHS ${Number(order.checkout.amount).toFixed(2)}`
                                : 'Pending'}
                            </p>
                          </div>
                          <ChevronRight className="h-6 w-6 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            <ShopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}

        {/* Help Section */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
                <CardDescription>
                  If you have any questions about your orders or need assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" onClick={() => router.push('/#contact')}>
                    Contact Support
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/shop')}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
