'use client';

import { JSX, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Notification } from '@/app/api';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type NotificationToastProps = {
  notification: Notification;
  onCloseAction: () => void;
  duration?: number;
};

export const NotificationToast = ({
  notification,
  onCloseAction,
  duration = 5000,
}: NotificationToastProps): JSX.Element => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onCloseAction, 300); // Wait for exit animation
      }, duration);

      return (): void => clearTimeout(timer);
    }
  }, [duration, onCloseAction]);

  const handleClick = (): void => {
    if (notification.link) {
      router.push(notification.link);
      onCloseAction();
    }
  };

  const handleClose = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(onCloseAction, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'pointer-events-auto relative flex w-full max-w-md cursor-pointer items-start gap-3 rounded-lg border bg-white p-4 shadow-lg dark:bg-gray-900',
            notification.link && 'hover:bg-gray-50 dark:hover:bg-gray-800',
          )}
          onClick={handleClick}
        >
          {/* Content */}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">{notification.title}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs">{notification.message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="shrink-0 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
