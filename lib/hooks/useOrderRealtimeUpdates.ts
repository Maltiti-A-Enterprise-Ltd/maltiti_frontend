'use client';

import { useCallback } from 'react';
import { TopicEnum, type Notification, OrderStatus } from '@/app/api';
import { useNotificationTopic } from '@/lib/hooks';

type OrderUpdatePayload = {
  orderId?: string;
  saleId?: string;
  status?: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  [key: string]: unknown;
};

type UseOrderRealtimeUpdatesOptions = {
  saleId: string;
  onOrderUpdateAction?: (payload: OrderUpdatePayload) => void;
  enabled?: boolean;
};

export const useOrderRealtimeUpdates = ({
  saleId,
  onOrderUpdateAction,
  enabled = true,
}: UseOrderRealtimeUpdatesOptions): void => {
  const handleNotification = useCallback(
    (notification: Notification): void => {
      // Check if this notification is for our specific order
      const payload = notification.payload as OrderUpdatePayload;

      if (payload.saleId === saleId || payload.orderId === saleId) {
        onOrderUpdateAction?.(payload);
      }
    },
    [saleId],
  );

  // Subscribe to order-related notification topics
  useNotificationTopic(
    [
      TopicEnum.ORDER_STATUS_UPDATED,
      TopicEnum.ORDER_DELIVERED,
      TopicEnum.ORDER_CANCELLED,
      TopicEnum.PAYMENT_RECEIVED,
    ],
    handleNotification,
    enabled,
  );
};
