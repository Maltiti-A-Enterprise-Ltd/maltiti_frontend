import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  notificationControllerGetNotifications,
  notificationControllerMarkAsRead,
  notificationControllerMarkAllAsRead,
  type Notification,
  type PaginatedNotificationsResponseDto,
} from '@/app/api';

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  isLoadingMore: boolean;
};

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  limit: 20,
  hasMore: true,
  isLoading: false,
  error: null,
  isLoadingMore: false,
};

export const fetchNotifications = createAsyncThunk<
  PaginatedNotificationsResponseDto,
  { page?: number; limit?: number },
  { rejectValue: string }
>('notifications/fetchNotifications', async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
  try {
    const response = await notificationControllerGetNotifications({
      query: { page, limit },
    });

    if (response.error) {
      return rejectWithValue('Failed to fetch notifications');
    }

    return response.data as PaginatedNotificationsResponseDto;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return rejectWithValue('Failed to fetch notifications');
  }
});

export const markNotificationAsRead = createAsyncThunk<string, string, { rejectValue: string }>(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationControllerMarkAsRead({
        body: { notificationId },
      });

      if (response.error) {
        return rejectWithValue('Failed to mark notification as read');
      }

      return notificationId;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return rejectWithValue('Failed to mark notification as read');
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk<void, void, { rejectValue: string }>(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationControllerMarkAllAsRead();

      if (response.error) {
        return rejectWithValue('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return rejectWithValue('Failed to mark all notifications as read');
    }
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add new notification at the beginning
      state.notifications.unshift(action.payload);
      state.total += 1;
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        const isNowRead = action.payload.isRead;

        state.notifications[index] = action.payload;

        // Update unread count if status changed
        if (wasUnread && isNowRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (!wasUnread && !isNowRead) {
          state.unreadCount += 1;
        }
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.total = 0;
      state.page = 1;
      state.hasMore = true;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.isLoading = true;
        } else {
          state.isLoadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;

        if (action.payload.page === 1) {
          state.notifications = action.payload.notifications;
        } else {
          state.notifications = [...state.notifications, ...action.payload.notifications];
        }

        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.hasMore = action.payload.hasMore;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          if (!notification.isRead) {
            notification.isRead = true;
            notification.readAt = new Date().toISOString();
          }
        });
        state.unreadCount = 0;
      });
  },
});

export const {
  addNotification,
  updateNotification,
  removeNotification,
  clearNotifications,
  resetError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
