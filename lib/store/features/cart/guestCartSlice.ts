import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GuestCartState } from './cartState';
import type { CartProductDto, ProductResponseDto } from '@/app/api';
import { generateUUID } from '@/lib/utils';

/**
 * Initial state for guest cart
 * This cart is persisted locally using redux-persist
 */
const initialState: GuestCartState = {
  items: [],
};

/**
 * Guest Cart Slice
 * Manages cart state for unauthenticated users
 * All operations are purely local - no API calls
 */
const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    /**
     * Add item to guest cart
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
     * Remove item from guest cart
     */
    removeFromGuestCart: (state, action: PayloadAction<string>) => {
      const cartId = action.payload;
      state.items = state.items.filter((item) => item.id !== cartId);
    },

    /**
     * Update item quantity in guest cart
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
     * Used after successful sync on login
     */
    clearGuestCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToGuestCart, removeFromGuestCart, updateGuestCartQuantity, clearGuestCart } =
  guestCartSlice.actions;

export default guestCartSlice.reducer;
