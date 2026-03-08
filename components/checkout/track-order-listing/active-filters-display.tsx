import { JSX } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus, PaymentStatus } from '@/app/api';
import { statusConfig, paymentStatusConfig } from './constants';

type ActiveFiltersDisplayProps = {
  filters: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  };
  onRemoveStatusFilter: () => void;
  onRemovePaymentFilter: () => void;
};

export function ActiveFiltersDisplay({
  filters,
  onRemoveStatusFilter,
  onRemovePaymentFilter,
}: Readonly<ActiveFiltersDisplayProps>): JSX.Element | null {
  const hasActiveFilters = filters.orderStatus || filters.paymentStatus;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Active Filters:</span>
      {filters.orderStatus && (
        <Badge variant="secondary" className="gap-1">
          Status: {statusConfig[filters.orderStatus].label}
          <button
            type="button"
            onClick={onRemoveStatusFilter}
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
            onClick={onRemovePaymentFilter}
            className="ml-1 rounded-full hover:bg-gray-300"
            aria-label="Remove payment filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
