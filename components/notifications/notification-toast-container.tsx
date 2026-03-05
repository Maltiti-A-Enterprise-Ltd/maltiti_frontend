'use client';

import { JSX, useState } from 'react';
import { type Notification, TopicEnum } from '@/app/api';
import { NotificationToast } from './notification-toast';
import { useNotificationTopic } from '@/lib/hooks';

type ToastNotification = Notification & {
  id: string;
};

export const NotificationToastContainer = (): JSX.Element => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Subscribe to all notification topics for toast display
  useNotificationTopic(Object.values(TopicEnum), (notification) => {
    // Add the notification to toasts
    setToasts((prev) => [notification as ToastNotification, ...prev].slice(0, 3)); // Keep max 3 toasts
  });

  const handleRemoveToast = (id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-50 flex w-full max-w-md flex-col gap-2">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          notification={toast}
          onCloseAction={() => handleRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};
