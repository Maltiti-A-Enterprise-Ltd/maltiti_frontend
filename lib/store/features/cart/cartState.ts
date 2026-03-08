import { CartDataDto, CartItemDto } from '@/app/api';

/**
 * State for authenticated user cart (synced with API)
 */
export type CartState = {
  cartData: CartDataDto;
  isLoading: {
    fetch: boolean;
    add: boolean;
    remove: boolean;
    update: boolean;
    sync: boolean;
  };
  error: {
    fetch: string | null;
    add: string | null;
    remove: string | null;
    update: string | null;
    sync: string | null;
  };
  lastSyncedAt: string | null; // Timestamp of last successful API sync
};

/**
 * State for guest user cart (stored locally with optional API sync)
 * Supports both offline and online operations
 */
export type GuestCartState = {
  items: CartItemDto[];
  isLoading?: boolean;
  error?: string | null;
};
