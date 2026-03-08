'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TopicEnum } from '@/app/api';
import { useAppDispatch } from '@/lib/store/hooks';
import { addNotification } from '@/lib/store/features/notifications';
import { toast } from 'sonner';

/**
 * Demo component to test notifications (for development only)
 * Remove this from production
 */
export const NotificationDemo = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const createMockNotification = (topic: TopicEnum, title: string, message: string): void => {
    const notification = {
      id: `mock-${crypto.randomUUID()}`,
      userId: 'current-user',
      topic,
      title,
      message,
      link: '/notifications',
      payload: {
        orderId: 'mock-order-123',
        status: 'PROCESSING',
      },
      isRead: false,
      readAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: '',
    };

    dispatch(addNotification(notification));
    toast.success('Mock notification created!');
  };

  const demoNotifications = [
    {
      topic: TopicEnum.ORDER_CREATED,
      title: 'New Order Placed',
      message: 'Your order #12345 has been received and is being processed.',
    },
    {
      topic: TopicEnum.ORDER_STATUS_UPDATED,
      title: 'Order Status Updated',
      message: 'Your order is now being prepared for shipment.',
    },
    {
      topic: TopicEnum.ORDER_STATUS_UPDATED,
      title: 'Order Shipped',
      message: 'Your order has been shipped and is on its way!',
    },
    {
      topic: TopicEnum.ORDER_DELIVERED,
      title: 'Order Delivered',
      message: 'Your order has been successfully delivered.',
    },
    {
      topic: TopicEnum.PAYMENT_RECEIVED,
      title: 'Payment Received',
      message: 'We have received your payment of GHS 150.00.',
    },
    {
      topic: TopicEnum.PRODUCT_BACK_IN_STOCK,
      title: 'Product Back in Stock',
      message: 'Organic Shea Butter is now available again!',
    },
    {
      topic: TopicEnum.REVIEW_APPROVED,
      title: 'Review Approved',
      message: 'Your product review has been approved and is now live.',
    },
    {
      topic: TopicEnum.SYSTEM_ANNOUNCEMENT,
      title: 'System Announcement',
      message: 'New features have been added to your dashboard!',
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🔔 Notification System Demo</CardTitle>
        <CardDescription>
          Click the buttons below to create mock notifications and test the system. Check the
          notification bell in the navbar to see them!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demoNotifications.map((notif, index) => (
            <Button
              key={`${index}-${notif.title}}`}
              variant="outline"
              className="h-auto justify-start py-3 text-left"
              onClick={() => createMockNotification(notif.topic, notif.title, notif.message)}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm font-semibold">{notif.title}</span>
                <span className="text-muted-foreground line-clamp-2 text-xs">{notif.message}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
