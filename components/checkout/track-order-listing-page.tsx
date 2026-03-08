'use client';

import { JSX } from 'react';
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
  Search,
  PackageSearch,
  AlertCircle,
  ChevronRight,
  Calendar,
  X,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { OrderStatus, PaymentStatus } from '@/app/api';
import { ShopPagination } from '@/components/shop';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTrackOrderListing, isValidEmail } from './track-order-listing';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/lib/store/features/auth';

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
  [PaymentStatus.AWAITING_DELIVERY]: {
    label: 'Awaiting Delivery',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
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

export default function TrackOrderListingPage(): JSX.Element {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const {
    email,
    searchInput,
    setSearchInput,
    isLoading,
    orders,
    hasSearched,
    showSearchCard,
    setShowSearchCard,
    currentPage,
    totalPages,
    totalItems,
    filters,
    setFilters,
    activeFilterCount,
    handleSearch,
    handleKeyDown,
    handleApplyFilters,
    handleClearFilters,
    handleViewOrder,
    handlePageChange,
    handleRemoveStatusFilter,
    handleRemovePaymentFilter,
    handleResetSearch,
  } = useTrackOrderListing();

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
            {isAuthenticated && user?.email && (
              <Button
                variant="outline"
                onClick={() => setShowSearchCard(!showSearchCard)}
                className="mt-4 gap-2"
              >
                <Search className="h-4 w-4" />
                {showSearchCard ? 'Hide Search' : 'Search Other Orders'}
              </Button>
            )}
          </motion.div>
        </div>

        {/* Search Section */}
        {showSearchCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="mb-8 border-2 border-green-100">
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="search-email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        id="search-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`h-12 pr-10 transition-colors ${((): string => {
                          if (!searchInput) {
                            return 'border-gray-300';
                          }
                          if (!isValidEmail(searchInput)) {
                            return 'border-red-300 focus-visible:ring-red-500';
                          }
                          return 'border-green-300 focus-visible:ring-green-500';
                        })()}`}
                        disabled={isLoading}
                      />
                      {searchInput && !isLoading && (
                        <button
                          type="button"
                          onClick={() => setSearchInput('')}
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                          aria-label="Clear email"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {searchInput && !isValidEmail(searchInput) && (
                      <p className="mt-1 text-xs text-red-600">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      disabled={isLoading || !searchInput.trim() || !isValidEmail(searchInput)}
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
        )}

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
                  {totalItems === 1 ? '' : 's'} for <span className="font-medium">{email}</span>
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
                      <SelectItem value={PaymentStatus.AWAITING_DELIVERY}>
                        Awaiting Delivery
                      </SelectItem>
                      <SelectItem value={PaymentStatus.PENDING_PAYMENT}>Payment Pending</SelectItem>
                      <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                      <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleApplyFilters}
                  disabled={isLoading || !email}
                  className="gap-2 bg-[#0F6938] hover:bg-[#0F6938]/90"
                >
                  <Filter className="h-4 w-4" />
                  Apply Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 bg-white text-[#0F6938]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={isLoading || !email || activeFilterCount === 0}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                {filters.orderStatus && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusConfig[filters.orderStatus].label}
                    <button
                      type="button"
                      onClick={handleRemoveStatusFilter}
                      className="ml-1 rounded-full hover:bg-gray-300"
                      aria-label="Remove status filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.paymentStatus && (
                  <Badge variant="secondary" className="gap-1">
                    Payment: {paymentStatusConfig[filters.paymentStatus].label}
                    <button
                      type="button"
                      onClick={handleRemovePaymentFilter}
                      className="ml-1 rounded-full hover:bg-gray-300"
                      aria-label="Remove payment filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
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
                  <Button variant="outline" onClick={handleResetSearch}>
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

              let displayTotal = 'Pending';
              if (order.total) {
                displayTotal = `GHS ${Number(order.total).toFixed(2)}`;
              } else if (order.amount) {
                displayTotal = `GHS ${Number(order.amount).toFixed(2)}+`;
              }

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
                            item{order.lineItems.length === 1 ? '' : 's'}
                          </div>
                        </div>

                        {/* Right Section - Price and Action */}
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <div className="flex-1 sm:flex-none">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-green-600">{displayTotal}</p>
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
