import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus, PaymentStatus } from '@/app/api';

type FilterSectionProps = {
  filters: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  };
  setFilters: (filters: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus }) => void;
  email: string;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  activeFilterCount: number;
  onApplyFilters: () => void;
  onClearFilters: () => void;
};

export function FilterSection({
  filters,
  setFilters,
  email,
  totalItems,
  currentPage,
  totalPages,
  isLoading,
  activeFilterCount,
  onApplyFilters,
  onClearFilters,
}: Readonly<FilterSectionProps>): JSX.Element {
  return (
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
                <SelectItem value={PaymentStatus.INVOICE_REQUESTED}>Invoice Requested</SelectItem>
                <SelectItem value={PaymentStatus.AWAITING_DELIVERY}>Awaiting Delivery</SelectItem>
                <SelectItem value={PaymentStatus.PENDING_PAYMENT}>Payment Pending</SelectItem>
                <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onApplyFilters}
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
            onClick={onClearFilters}
            disabled={isLoading || !email || activeFilterCount === 0}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
