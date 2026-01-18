import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  cartControllerGetGuestCart,
  cartControllerAddToGuestCart,
  cartControllerRemoveFromGuestCart,
  cartControllerUpdateGuestCartQuantity,
  cartControllerRemoveAllFromGuestCart,
} from '@/app/api';
import { getGuestSessionId } from '@/lib/session-utils';
import { toast } from 'sonner';

/**
 * Fetch guest cart from API
 * Retrieves all cart items for the current guest session
 */
export const fetchGuestCart = createAsyncThunk(
  'guestCart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = getGuestSessionId();

      const { data, error } = await cartControllerGetGuestCart({
        path: { sessionId },
      });

      if (error || !data) {
        return rejectWithValue((error as { message?: string })?.message || 'Failed to fetch cart');
      }

      return data.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to fetch cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Add item to guest cart (API)
 * Adds a product to the guest user's cart on the server
 */
export const addToGuestCartAPI = createAsyncThunk(
  'guestCart/addToCart',
  async (
    { productId, quantity }: { productId: string; quantity?: number },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const sessionId = getGuestSessionId();

      const { data, error } = await cartControllerAddToGuestCart({
        body: {
          sessionId,
          id: productId,
          quantity: quantity || 1,
        },
      });

      if (error || !data) {
        const errorMessage =
          (error as { message?: string })?.message || 'Failed to add item to cart';
        toast.error('Failed to add item', {
          description: errorMessage,
        });
        return rejectWithValue(errorMessage);
      }

      // Fetch updated cart after adding item
      dispatch(fetchGuestCart());

      return data.data;
    } catch (error: unknown) {
      const errorMessage = 'An unexpected error occurred';
      toast.error('Error', {
        description: errorMessage,
      });

      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || errorMessage);
      }
      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Remove item from guest cart (API)
 * Removes a specific cart item from the server
 */
export const removeFromGuestCartAPI = createAsyncThunk(
  'guestCart/removeFromCart',
  async (cartItemId: string, { rejectWithValue, dispatch }) => {
    try {
      const sessionId = getGuestSessionId();

      const { data, error } = await cartControllerRemoveFromGuestCart({
        path: { cartId: cartItemId },
        query: { sessionId },
      });

      if (error || !data) {
        const errorMessage =
          (error as { message?: string })?.message || 'Failed to remove item from cart';
        toast.error('Failed to remove item', {
          description: errorMessage,
        });
        return rejectWithValue(errorMessage);
      }

      toast.success('Item removed', {
        description: 'Item has been removed from your cart',
      });

      // Fetch updated cart after removing item
      dispatch(fetchGuestCart());

      return data.data;
    } catch (error: unknown) {
      const errorMessage = 'An unexpected error occurred';
      toast.error('Error', {
        description: errorMessage,
      });

      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || errorMessage);
      }
      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Update guest cart item quantity (API)
 * Updates the quantity of a specific cart item
 */
export const updateGuestCartQuantityAPI = createAsyncThunk(
  'guestCart/updateQuantity',
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { rejectWithValue, dispatch },
  ) => {
    try {
      if (quantity < 1) {
        return rejectWithValue('Quantity must be at least 1');
      }

      const sessionId = getGuestSessionId();

      const { data, error } = await cartControllerUpdateGuestCartQuantity({
        path: { cartId: cartItemId },
        body: { sessionId, quantity },
      });

      if (error || !data) {
        const errorMessage =
          (error as { message?: string })?.message || 'Failed to update quantity';
        toast.error('Failed to update quantity', {
          description: errorMessage,
        });
        return rejectWithValue(errorMessage);
      }

      // Fetch updated cart after updating quantity
      dispatch(fetchGuestCart());

      return data.data;
    } catch (error: unknown) {
      const errorMessage = 'An unexpected error occurred';
      toast.error('Error', {
        description: errorMessage,
      });

      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || errorMessage);
      }
      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Clear all items from guest cart (API)
 * Removes all cart items for the guest session
 */
export const clearGuestCartAPI = createAsyncThunk(
  'guestCart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = getGuestSessionId();

      const { data, error } = await cartControllerRemoveAllFromGuestCart({
        path: { sessionId },
      });

      if (error || !data) {
        const errorMessage = (error as { message?: string })?.message || 'Failed to clear cart';
        toast.error('Failed to clear cart', {
          description: errorMessage,
        });
        return rejectWithValue(errorMessage);
      }

      toast.success('Cart cleared', {
        description: 'All items have been removed from your cart',
      });

      return data.data;
    } catch (error: unknown) {
      const errorMessage = 'An unexpected error occurred';
      toast.error('Error', {
        description: errorMessage,
      });

      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || errorMessage);
      }
      return rejectWithValue(errorMessage);
    }
  },
);

/**
 * Sync local guest cart with server
 * Useful when transitioning from localStorage to API-based cart
 */
export const syncGuestCartToServer = createAsyncThunk(
  'guestCart/syncToServer',
  async (localItems: Array<{ productId: string; quantity: number }>, { dispatch }) => {
    try {
      // Add each local item to server
      for (const item of localItems) {
        await dispatch(
          addToGuestCartAPI({
            productId: item.productId,
            quantity: item.quantity,
          }),
        ).unwrap();
      }

      // Fetch the complete cart from server
      await dispatch(fetchGuestCart()).unwrap();

      toast.success('Cart synced', {
        description: 'Your cart has been synced with the server',
      });

      return true;
    } catch (error) {
      toast.error('Sync failed', {
        description: 'Failed to sync cart with server',
      });
      throw error;
    }
  },
);
