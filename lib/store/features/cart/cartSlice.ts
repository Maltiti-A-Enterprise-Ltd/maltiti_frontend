import { createSlice } from '@reduxjs/toolkit';
import type { CartState } from './cartState';
import {
  addToCart,
  clearCart,
  fetchCart,
  removeFromCart,
  syncGuestCart,
  updateCartQuantity,
} from './cartThunk';

/**
 * Initial state for authenticated user cart
 */
const initialState: CartState = {
  cartData: {
    count: 0,
    items: [],
    total: 0,
  },
  isLoading: {
    fetch: false,
    add: false,
    remove: false,
    update: false,
    sync: false,
  },
  error: {
    fetch: null,
    add: null,
    remove: null,
    update: null,
    sync: null,
  },
  lastSyncedAt: null,
};

/**
 * Cart Slice
 * Manages cart state for authenticated users
 * All operations interact with the API
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Clear all cart errors
     */
    clearCartErrors: (state) => {
      state.error = {
        fetch: null,
        add: null,
        remove: null,
        update: null,
        sync: null,
      };
    },

    /**
     * Clear specific cart error
     */
    clearCartError: (state, action: { payload: keyof CartState['error'] }) => {
      state.error[action.payload] = null;
    },

    /**
     * Reset cart state (used on logout)
     */
    resetCart: (state) => {
      state.cartData = {
        count: 0,
        items: [],
        total: 0,
      };
      state.lastSyncedAt = null;
      state.error = {
        fetch: null,
        add: null,
        remove: null,
        update: null,
        sync: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading.fetch = false;
        // Parse cart data from API response
        // Adjust this based on actual API response structure

        state.cartData = action.payload;
        state.lastSyncedAt = new Date().toISOString();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading.fetch = false;
        state.error.fetch = action.payload as string;
      });

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading.add = true;
        state.error.add = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading.add = false;
        // Cart will be updated via fetchCart dispatch
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading.add = false;
        state.error.add = action.payload as string;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading.remove = true;
        state.error.remove = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isLoading.remove = false;
        // Cart will be updated via fetchCart dispatch
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading.remove = false;
        state.error.remove = action.payload as string;
      });

    // Update Cart Quantity
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading.update = true;
        state.error.update = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state) => {
        state.isLoading.update = false;
        // Cart will be updated via fetchCart dispatch
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading.update = false;
        state.error.update = action.payload as string;
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading.remove = true;
        state.error.remove = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading.remove = false;
        state.cartData = {
          count: 0,
          items: [],
          total: 0,
        };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading.remove = false;
        state.error.remove = action.payload as string;
      });

    // Sync Guest Cart
    builder
      .addCase(syncGuestCart.pending, (state) => {
        state.isLoading.sync = true;
        state.error.sync = null;
      })
      .addCase(syncGuestCart.fulfilled, (state) => {
        state.isLoading.sync = false;
        // Cart will be updated via fetchCart dispatch
        state.lastSyncedAt = new Date().toISOString();
      })
      .addCase(syncGuestCart.rejected, (state, action) => {
        state.isLoading.sync = false;
        state.error.sync = action.payload as string;
      });
  },
});

export const { clearCartErrors, clearCartError, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
