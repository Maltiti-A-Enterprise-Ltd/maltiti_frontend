import React from 'react';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { OrderStatus, PaymentStatus } from '@/app/api';

export const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
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

export const paymentStatusConfig: Record<
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

