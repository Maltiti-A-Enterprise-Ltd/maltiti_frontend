'use client';

import { JSX, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCheck, Loader2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/lib/hooks';
import { NotificationItem } from './notification-item';

type NotificationListProps = {
  onCloseAction?: () => void;
};

export const NotificationList = ({ onCloseAction }: NotificationListProps): JSX.Element => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleNotificationClick = useCallback(
    async (notificationId: string, link: string): Promise<void> => {
      await markAsRead(notificationId);
      if (link) {
        router.push(link);
        onCloseAction?.();
      }
    },
    [],
  );

  const handleMarkAllAsRead = useCallback(async (): Promise<void> => {
    await markAllAsRead();
  }, []);

  const handleLoadMore = useCallback((): void => {
    void loadMore();
  }, []);

  const notificationContent = ((): JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex h-100 items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      );
    } else if (notifications.length === 0) {
      return (
        <div className="flex h-100 flex-col items-center justify-center gap-2 text-center">
          <Bell className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground text-sm">No notifications yet</p>
          <p className="text-muted-foreground text-xs">
            We&#39;ll notify you when something happens
          </p>
        </div>
      );
    }
    return (
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClickAction={() => handleNotificationClick(notification.id, notification.link)}
          />
        ))}

        {hasMore && (
          <div className="p-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load more'
              )}
            </Button>
          </div>
        )}
      </div>
    );
  })();

  return (
    <div className="flex h-125 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && <p className="text-muted-foreground text-sm">{unreadCount} unread</p>}
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <ScrollArea className="flex-1 overflow-auto" onWheel={(e) => e.stopPropagation()}>
        {notificationContent}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                router.push('/notifications');
                onCloseAction?.();
              }}
            >
              View all notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
