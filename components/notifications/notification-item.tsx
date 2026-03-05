'use client';

import { JSX } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  ShoppingBag,
  CreditCard,
  Package,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  User,
  Star,
  Bell,
} from 'lucide-react';
import { type Notification, TopicEnum } from '@/app/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type NotificationItemProps = {
  notification: Notification;
  onClickAction: () => void;
};

const getNotificationIcon = (topic: TopicEnum): JSX.Element => {
  const iconClass = 'h-5 w-5';

  switch (topic) {
    case TopicEnum.ORDER_CREATED:
    case TopicEnum.ADMIN_NEW_ORDER:
      return <ShoppingBag className={iconClass} />;

    case TopicEnum.ORDER_STATUS_UPDATED:
      return <Package className={iconClass} />;

    case TopicEnum.ORDER_DELIVERED:
      return <CheckCircle className={iconClass} />;

    case TopicEnum.ORDER_CANCELLED:
    case TopicEnum.ADMIN_ORDER_CANCELLED:
      return <AlertCircle className={iconClass} />;

    case TopicEnum.PAYMENT_RECEIVED:
    case TopicEnum.PAYMENT_FAILED:
      return <CreditCard className={iconClass} />;

    case TopicEnum.REFUND_PROCESSED:
      return <CreditCard className={iconClass} />;

    case TopicEnum.PRODUCT_CREATED:
    case TopicEnum.PRODUCT_PRICE_CHANGED:
    case TopicEnum.PRODUCT_OUT_OF_STOCK:
    case TopicEnum.PRODUCT_BACK_IN_STOCK:
      return <TrendingUp className={iconClass} />;

    case TopicEnum.USER_ACCOUNT_CREATED:
    case TopicEnum.USER_EMAIL_VERIFIED:
    case TopicEnum.USER_PASSWORD_RESET:
    case TopicEnum.USER_PROFILE_UPDATED:
      return <User className={iconClass} />;

    case TopicEnum.REVIEW_SUBMITTED:
    case TopicEnum.REVIEW_APPROVED:
    case TopicEnum.REVIEW_REJECTED:
      return <Star className={iconClass} />;

    case TopicEnum.ADMIN_CONTACT_FORM_SUBMITTED:
    case TopicEnum.ADMIN_LOW_STOCK_ALERT:
      return <AlertCircle className={iconClass} />;

    case TopicEnum.SYSTEM_MAINTENANCE:
    case TopicEnum.SYSTEM_ANNOUNCEMENT:
      return <Info className={iconClass} />;

    default:
      return <Bell className={iconClass} />;
  }
};

const getNotificationColor = (topic: TopicEnum): string => {
  switch (topic) {
    case TopicEnum.ORDER_CREATED:
    case TopicEnum.ORDER_DELIVERED:
    case TopicEnum.PAYMENT_RECEIVED:
    case TopicEnum.PRODUCT_BACK_IN_STOCK:
    case TopicEnum.REVIEW_APPROVED:
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';

    case TopicEnum.ORDER_CANCELLED:
    case TopicEnum.PAYMENT_FAILED:
    case TopicEnum.PRODUCT_OUT_OF_STOCK:
    case TopicEnum.ADMIN_LOW_STOCK_ALERT:
    case TopicEnum.REVIEW_REJECTED:
      return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';

    case TopicEnum.ORDER_STATUS_UPDATED:
    case TopicEnum.REFUND_PROCESSED:
    case TopicEnum.PRODUCT_PRICE_CHANGED:
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';

    case TopicEnum.SYSTEM_MAINTENANCE:
    case TopicEnum.SYSTEM_ANNOUNCEMENT:
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';

    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const NotificationItem = ({
  notification,
  onClickAction,
}: NotificationItemProps): JSX.Element => {
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClickAction}
      className={cn(
        'hover:bg-muted/50 w-full cursor-pointer px-4 py-3 text-left transition-colors',
        !notification.isRead && 'bg-blue-50/50 dark:bg-blue-950/20',
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            getNotificationColor(notification.topic),
          )}
        >
          {getNotificationIcon(notification.topic)}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn('text-sm font-medium', !notification.isRead && 'font-semibold')}>
              {notification.title}
            </p>
            {!notification.isRead && <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
          </div>

          <p className="text-muted-foreground line-clamp-2 text-xs">{notification.message}</p>

          <p className="text-muted-foreground text-xs">{formattedTime}</p>
        </div>
      </div>
    </motion.button>
  );
};
