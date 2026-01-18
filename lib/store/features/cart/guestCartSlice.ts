import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GuestCartState } from './cartState';
import type { CartProductDto, ProductResponseDto, CartDataDto } from '@/app/api';
import { generateUUID } from '@/lib/utils';
import {
  fetchGuestCart,
  addToGuestCartAPI,
  removeFromGuestCartAPI,
  updateGuestCartQuantityAPI,
  clearGuestCartAPI,
} from './guestCartThunk';

/**
 * Initial state for guest cart
 * Now includes API state management
 */
const initialState: GuestCartState = {
  items: [],
  isLoading: false,
  error: null,
};

/**
 * Guest Cart Slice
 * Manages cart state for unauthenticated users
 * Supports both local operations and API synchronization
 */
const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    /**
     * Add item to guest cart (LOCAL ONLY - for offline support)
     * If item already exists, increment quantity
     */
    addToGuestCart: (
      state,
      action: PayloadAction<{ product: ProductResponseDto; quantity?: number }>,
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Item already in cart - increment quantity
        existingItem.quantity += quantity;
      } else {
        // New item - add to cart
        state.items.push({
          id: generateUUID(),
          product: product as CartProductDto,
          quantity,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
        });
      }
    },

    /**
     * Remove item from guest cart (LOCAL ONLY)
     */
    removeFromGuestCart: (state, action: PayloadAction<string>) => {
      const cartId = action.payload;
      state.items = state.items.filter((item) => item.id !== cartId);
    },

    /**
     * Update item quantity in guest cart (LOCAL ONLY)
     * If quantity is 0 or less, remove the item
     */
    updateGuestCartQuantity: (
      state,
      action: PayloadAction<{ cartId: string; quantity: number }>,
    ) => {
      const { cartId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.items = state.items.filter((item) => item.id !== cartId);
      } else {
        const item = state.items.find((item) => item.id === cartId);
        if (item) {
          item.quantity = quantity;
        }
      }
    },

    /**
     * Clear all items from guest cart
     * Used after successful sync on login or checkout
     */
    clearGuestCart: (state) => {
      state.items = [];
      state.error = null;
    },

    /**
     * Set cart items directly (useful for sync operations)
     */
    setGuestCartItems: (state, action: PayloadAction<GuestCartState['items']>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch guest cart
    builder
      .addCase(fetchGuestCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuestCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cartData = action.payload as CartDataDto;
        state.items = cartData.items || [];
      })
      .addCase(fetchGuestCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to guest cart (API)
    builder
      .addCase(addToGuestCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToGuestCartAPI.fulfilled, (state) => {
        state.isLoading = false;
        // Cart will be updated by fetchGuestCart dispatch
      })
      .addCase(addToGuestCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from guest cart (API)
    builder
      .addCase(removeFromGuestCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromGuestCartAPI.fulfilled, (state) => {
        state.isLoading = false;
        // Cart will be updated by fetchGuestCart dispatch
      })
      .addCase(removeFromGuestCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update guest cart quantity (API)
    builder
      .addCase(updateGuestCartQuantityAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGuestCartQuantityAPI.fulfilled, (state) => {
        state.isLoading = false;
        // Cart will be updated by fetchGuestCart dispatch
      })
      .addCase(updateGuestCartQuantityAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Clear guest cart (API)
    builder
      .addCase(clearGuestCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearGuestCartAPI.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
      })
      .addCase(clearGuestCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToGuestCart,
  removeFromGuestCart,
  updateGuestCartQuantity,
  clearGuestCart,
  setGuestCartItems,
} = guestCartSlice.actions;

export default guestCartSlice.reducer;
