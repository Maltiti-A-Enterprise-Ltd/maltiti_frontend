'use client';

import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/lib/hooks';
import { NotificationItem } from '@/components/notifications';

export default function NotificationsPage(): JSX.Element {
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

  const handleNotificationClick = async (notificationId: string, link: string): Promise<void> => {
    await markAsRead(notificationId);
    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    await markAllAsRead();
  };

  const handleLoadMore = (): void => {
    void loadMore();
  };

  const notificationContent = ((): JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex h-100 items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      );
    } else if (notifications.length === 0) {
      return (
        <div className="flex h-100 flex-col items-center justify-center gap-2 p-8 text-center">
          <div className="rounded-full bg-gray-100 p-4">
            <svg
              className="text-muted-foreground h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No notifications yet</h3>
          <p className="text-muted-foreground max-w-md text-sm">
            We&#39;ll notify you when something important happens with your orders or account
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
          <div className="p-6 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading more...
                </>
              ) : (
                'Load more notifications'
              )}
            </Button>
          </div>
        )}
      </div>
    );
  })();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12 pt-28">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 gap-2 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="mt-2 text-gray-600">
                  You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead} className="gap-2">
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="rounded-lg border bg-white shadow-sm">{notificationContent}</div>
      </div>
    </div>
  );
}
