import { io, Socket } from 'socket.io-client';
import { type Notification, TopicEnum } from '@/app/api';

type NotificationHandler = (notification: Notification) => void;
type ErrorHandler = (error: Error) => void;
type ConnectionStatusHandler = (status: 'connected' | 'disconnected' | 'error') => void;

type NotificationServiceConfig = {
  baseUrl: string;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
};

class NotificationService {
  private socket: Socket | null = null;
  private readonly handlers: Map<TopicEnum | 'all', Set<NotificationHandler>> = new Map();
  private readonly errorHandlers: Set<ErrorHandler> = new Set();
  private readonly statusHandlers: Set<ConnectionStatusHandler> = new Set();
  private readonly config: Required<NotificationServiceConfig>;
  private isIntentionallyClosed = false;

  constructor(config: NotificationServiceConfig) {
    this.config = {
      reconnectDelay: 3000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(accessToken?: string): void {
    if (this.socket) {
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      this.socket = io(`${this.config.baseUrl}/notifications`, {
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        this.notifyStatusHandlers('connected');
      });

      this.socket.on('disconnect', () => {
        this.notifyStatusHandlers('disconnected');
      });

      this.socket.on('notification', (notification: Notification) => {
        this.handleNotification(notification);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.notifyStatusHandlers('error');
        this.notifyErrorHandlers(error);
      });
    } catch (error) {
      console.error('Failed to establish socket connection:', error);
      this.notifyErrorHandlers(error as Error);
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.notifyStatusHandlers('disconnected');
    }
  }

  subscribe(topic: TopicEnum | 'all', handler: NotificationHandler): () => void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }

    this.handlers.get(topic)?.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(topic)?.delete(handler);
      if (this.handlers.get(topic)?.size === 0) {
        this.handlers.delete(topic);
      }
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);

    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  onStatusChange(handler: ConnectionStatusHandler): () => void {
    this.statusHandlers.add(handler);

    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  private handleNotification(notification: Notification): void {
    // Notify 'all' handlers
    this.handlers.get('all')?.forEach((handler) => {
      try {
        handler(notification);
      } catch (error) {
        console.error('Error in notification handler:', error);
      }
    });

    // Notify topic-specific handlers
    if (notification.topic) {
      this.handlers.get(notification.topic)?.forEach((handler) => {
        try {
          handler(notification);
        } catch (error) {
          console.error('Error in notification handler:', error);
        }
      });
    }
  }

  private notifyErrorHandlers(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    });
  }

  private notifyStatusHandlers(status: 'connected' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach((handler) => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error in status handler:', error);
      }
    });
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  getConnectionState(): number {
    return this.socket?.connected ? 1 : 0;
  }
}

// Create singleton instance
let notificationServiceInstance: NotificationService | null = null;

export const getNotificationService = (): NotificationService => {
  if (!notificationServiceInstance) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    notificationServiceInstance = new NotificationService({ baseUrl });
  }
  return notificationServiceInstance;
};

export default NotificationService;
