import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addNotification,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/store/features/notifications';
import { getNotificationService } from '@/lib/services/notification-service';
import { type Notification, TopicEnum } from '@/app/api';

type UseNotificationsReturn = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export const useNotifications = (): UseNotificationsReturn => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, isLoadingMore, hasMore, page, limit, error } =
    useAppSelector((state) => state.notifications);

  const loadNotifications = useCallback(async (): Promise<void> => {
    await dispatch(fetchNotifications({ page: 1, limit })).unwrap();
  }, [dispatch, limit]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    await dispatch(fetchNotifications({ page: page + 1, limit })).unwrap();
  }, [dispatch, hasMore, isLoadingMore, page, limit]);

  const markAsRead = useCallback(
    async (notificationId: string): Promise<void> => {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    },
    [dispatch],
  );

  const markAllAsRead = useCallback(async (): Promise<void> => {
    await dispatch(markAllNotificationsAsRead()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    void loadNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
};

type UseRealtimeNotificationsOptions = {
  enabled?: boolean;
  topics?: TopicEnum[];
};

type UseRealtimeNotificationsReturn = {
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'error';
};

export const useRealtimeNotifications = (
  options: UseRealtimeNotificationsOptions = {},
): UseRealtimeNotificationsReturn => {
  const { enabled = true } = options;
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const notificationService = getNotificationService();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>(
    'disconnected',
  );

  useEffect(() => {
    if (!enabled || !accessToken) {
      return;
    }

    // Connect to notification service
    notificationService.connect(accessToken);

    // Subscribe to all notifications
    const unsubscribeAll = notificationService.subscribe('all', (notification) => {
      dispatch(addNotification(notification));
    });

    // Subscribe to status changes
    const unsubscribeStatus = notificationService.onStatusChange((status) => {
      setConnectionStatus(status);
      setIsConnected(status === 'connected');
    });

    return (): void => {
      unsubscribeAll();
      unsubscribeStatus();
      notificationService.disconnect();
    };
  }, [enabled, accessToken, dispatch, notificationService]);

  return {
    isConnected,
    connectionStatus,
  };
};

type NotificationCallback = (notification: Notification) => void;

export const useNotificationTopic = (
  topic: TopicEnum | TopicEnum[],
  callback: NotificationCallback,
  enabled = true,
): void => {
  const notificationService = getNotificationService();
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const topics = Array.isArray(topic) ? topic : [topic];
    const unsubscribers: Array<() => void> = [];

    topics.forEach((t) => {
      const unsubscribe = notificationService.subscribe(t, (notification) => {
        callbackRef.current(notification);
      });
      unsubscribers.push(unsubscribe);
    });

    return (): void => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [topic, enabled, notificationService]);
};
