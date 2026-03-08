import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  cartControllerAddToCart,
  cartControllerGetCart,
  cartControllerRemoveFromCart,
  cartControllerAddQuantity,
  cartControllerRemoveAllFromCart,
  cartControllerBulkAddToCart,
  AddBulkCartItemDto,
} from '@/app/api';
import type { RootState } from '@/lib/store/store';
import type { GuestCartState } from './cartState';
import { clearGuestCart } from './guestCartSlice';

/**
 * Fetch cart from API
 * Gets the authenticated user's cart from the server
 */
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await cartControllerGetCart();

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
});

/**
 * Add item to cart (API)
 * Adds a product to the authenticated user's cart
 */
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, quantity }: { productId: string; quantity?: number },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const { data, error } = await cartControllerAddToCart({
        body: { id: productId, quantity },
      });

      if (error || !data) {
        return rejectWithValue(
          (error as { message?: string })?.message || 'Failed to add item to cart',
        );
      }

      // Fetch updated cart after adding item
      dispatch(fetchCart());

      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to add item to cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Remove item from cart (API)
 * Removes a specific cart item
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string, { rejectWithValue, dispatch }) => {
    try {
      const { data, error } = await cartControllerRemoveFromCart({
        path: { id: cartItemId },
      });

      if (error || !data) {
        return rejectWithValue(
          (error as { message?: string })?.message || 'Failed to remove item from cart',
        );
      }

      // Fetch updated cart after removing item
      dispatch(fetchCart());

      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to remove item from cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Update cart item quantity (API)
 * Updates the quantity of a specific cart item
 */
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const { data, error } = await cartControllerAddQuantity({
        path: { id: cartItemId },
        body: { quantity },
      });

      if (error || !data) {
        return rejectWithValue(
          (error as { message?: string })?.message || 'Failed to update cart quantity',
        );
      }

      // Fetch updated cart after updating quantity
      dispatch(fetchCart());

      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to update cart quantity');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Clear entire cart (API)
 * Removes all items from the authenticated user's cart
 */
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const { data, error } = await cartControllerRemoveAllFromCart();

      if (error || !data) {
        return rejectWithValue((error as { message?: string })?.message || 'Failed to clear cart');
      }

      // Fetch updated cart after clearing
      dispatch(fetchCart());

      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to clear cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

/**
 * Sync guest cart to authenticated cart using bulk add endpoint
 * Called automatically after successful login
 * Merges local guest cart items with server cart using a single API call
 */
export const syncGuestCart = createAsyncThunk(
  'cart/syncGuestCart',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const guestCart: GuestCartState = state.guestCart;

      // If guest cart is empty, nothing to sync
      if (!guestCart.items || guestCart.items.length === 0) {
        return { success: true, itemsSynced: 0 };
      }

      const bulkItems: AddBulkCartItemDto[] = guestCart.items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

      // Use bulk add endpoint to add all items in one request
      const { data, error } = await cartControllerBulkAddToCart({
        body: { items: bulkItems },
      });

      if (error || !data) {
        return rejectWithValue((error as { message?: string })?.message || 'Failed to sync cart');
      }

      // Clear guest cart after successful sync
      dispatch(clearGuestCart());

      // Fetch the updated cart from server
      dispatch(fetchCart());

      return {
        success: true,
        itemsSynced: guestCart.items.length,
        itemsFailed: 0,
      };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as { error?: { message?: string } };
        return rejectWithValue(apiError.error?.message || 'Failed to sync cart');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);
