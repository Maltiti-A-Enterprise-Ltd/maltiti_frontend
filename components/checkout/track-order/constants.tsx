import { Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { OrderStatus, PaymentStatus } from '@/app/api';
import { StatusConfig, PaymentStatusConfig } from './types';

export const statusConfig: StatusConfig = {
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

export const paymentStatusConfig: PaymentStatusConfig = {
  [PaymentStatus.INVOICE_REQUESTED]: {
    label: 'Invoice Requested',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <Clock className="h-5 w-5" />,
    description: 'Invoice has been requested',
  },
  [PaymentStatus.AWAITING_DELIVERY]: {
    label: 'Awaiting Delivery',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: <Truck className="h-5 w-5" />,
    description: 'Payment is pending delivery confirmation',
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

export const stepOrder: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PACKAGING,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED,
];
