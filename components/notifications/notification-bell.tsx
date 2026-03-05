'use client';

import { JSX, useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { NotificationList } from './notification-list';
import { useNotifications } from '@/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, loadNotifications } = useNotifications();
  const [showPulse, setShowPulse] = useState(false);
  const prevUnreadCountRef = useRef(unreadCount);

  // Show pulse animation when unread count increases
  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return (): void => clearTimeout(timer);
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // Load notifications when popover opens
  useEffect(() => {
    if (isOpen) {
      void loadNotifications();
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={cn(
                  'absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white',
                  showPulse && 'animate-pulse',
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>

          {showPulse && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500"
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-100 p-0" sideOffset={8}>
        <NotificationList onCloseAction={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
