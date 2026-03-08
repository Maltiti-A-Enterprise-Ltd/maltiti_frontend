'use client';

import { JSX, ReactNode } from 'react';
import { useRealtimeNotifications } from '@/lib/hooks';
import { useAppSelector } from '@/lib/store/hooks';

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider = ({ children }: NotificationProviderProps): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user;

  // Connect to real-time notifications only when authenticated
  useRealtimeNotifications({
    enabled: isAuthenticated,
  });

  return <>{children}</>;
};
