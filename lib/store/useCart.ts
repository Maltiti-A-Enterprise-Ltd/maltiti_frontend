import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartQuantity as updateCartQuantityAPI,
  clearCart as clearCartAPI,
  fetchCart,
} from './features/cart/cartThunk';
import {
  fetchGuestCart,
  addToGuestCartAPI,
  removeFromGuestCartAPI,
  updateGuestCartQuantityAPI,
  clearGuestCartAPI,
} from '@/lib/store/features/cart';
import type { CartItemDto, ProductResponseDto } from '@/app/api';
import type { CartState, GuestCartState } from './features/cart/cartState';
import { selectIsAuthenticated } from '@/lib/store/features/auth';
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
  selectGuestCart,
} from '@/lib/store/features/cart/cartSelector';

type UseCartReturn = {
  items: CartItemDto[];
  totalItems: number;
  totalPrice: number;
  isAuthenticated: boolean;
  addItem: (product: ProductResponseDto, quantity?: number) => Promise<void>;
  removeItem: (productIdOrCartItemId: string) => Promise<void>;
  updateQuantity: (productIdOrCartItemId: string, quantity: number) => Promise<void>;
  clearAllItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
  isAdding: boolean;
  isFetching: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  isSyncing: boolean;
  error: string | null;
  cart: CartState | null;
  guestCart: GuestCartState | null;
  getCart: () => void;
};

/**
 * Custom hook for cart operations
 * Automatically handles authenticated vs guest user logic
 * Now uses API for both authenticated and guest users
 */
export const useCart = (): UseCartReturn => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cart = useAppSelector((state) => state.cart);
  const cartItems = useAppSelector(selectCartItems);
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const guestCart = useAppSelector(selectGuestCart);

  const getCart = (): void => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      dispatch(fetchGuestCart());
    }
  };

  /**
   * Add item to cart
   * Uses API for both authenticated and guest users
   */
  const addItem = useCallback(
    async (product: ProductResponseDto, quantity = 1): Promise<void> => {
      if (isAuthenticated) {
        // User is logged in - use authenticated API
        await dispatch(
          addToCartAPI({
            productId: product.id,
            quantity,
          }),
        ).unwrap();
      } else {
        // Guest user - use guest API
        await dispatch(
          addToGuestCartAPI({
            productId: product.id,
            quantity,
          }),
        ).unwrap();
      }
    },
    [dispatch, isAuthenticated],
  );

  /**
   * Remove item from cart
   * For authenticated users, use cart item ID
   * For guests, also use cart item ID (from API response)
   */
  const removeItem = useCallback(
    async (cartItemId: string): Promise<void> => {
      if (isAuthenticated) {
        // User is logged in - use authenticated API
        await dispatch(removeFromCartAPI(cartItemId)).unwrap();
      } else {
        // Guest user - use guest API
        await dispatch(removeFromGuestCartAPI(cartItemId)).unwrap();
      }
    },
    [dispatch, isAuthenticated],
  );
  /**
   * Update item quantity
   * Uses API for both authenticated and guest users
   */
  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number): Promise<void> => {
      if (isAuthenticated) {
        // User is logged in - use authenticated API
        await dispatch(
          updateCartQuantityAPI({
            cartItemId,
            quantity,
          }),
        ).unwrap();
      } else {
        // Guest user - use guest API
        await dispatch(
          updateGuestCartQuantityAPI({
            cartItemId,
            quantity,
          }),
        ).unwrap();
      }
    },
    [dispatch, isAuthenticated],
  );

  /**
   * Clear all items from cart
   * Uses API for both authenticated and guest users
   */
  const clearAllItems = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      // User is logged in - use authenticated API
      await dispatch(clearCartAPI()).unwrap();
    } else {
      // Guest user - use guest API
      await dispatch(clearGuestCartAPI()).unwrap();
    }
  }, [dispatch, isAuthenticated]);

  /**
   * Refresh cart from server
   * Applicable for both authenticated and guest users
   */
  const refreshCart = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      await dispatch(fetchCart()).unwrap();
    } else {
      await dispatch(fetchGuestCart()).unwrap();
    }
  }, [dispatch, isAuthenticated]);

  /**
   * Get current cart items and totals
   * Returns appropriate cart based on auth status
   */
  // let currentCart: CartItemDto = isAuthenticated ? cart : guestCart;
  // const items = currentCart.items;
  // const totalItems = currentCart.totalItems;
  // const totalPrice = currentCart.totalPrice;

  /**
   * Loading states - works for both authenticated and guest users
   */
  const isLoading = isAuthenticated
    ? cart.isLoading.add || cart.isLoading.fetch || cart.isLoading.update || cart.isLoading.remove
    : guestCart.isLoading || false;

  const isAdding = isAuthenticated ? cart.isLoading.add : guestCart.isLoading || false;
  const isFetching = isAuthenticated ? cart.isLoading.fetch : guestCart.isLoading || false;
  const isUpdating = isAuthenticated ? cart.isLoading.update : guestCart.isLoading || false;
  const isRemoving = isAuthenticated ? cart.isLoading.remove : guestCart.isLoading || false;
  const isSyncing = isAuthenticated ? cart.isLoading.sync : false;

  /**
   * Error states - works for both authenticated and guest users
   */
  const error = isAuthenticated
    ? cart.error.add || cart.error.fetch || cart.error.update || cart.error.remove
    : guestCart.error || null;

  return {
    // Cart data
    items: cartItems,
    totalItems: cartItemsCount,
    totalPrice: cartTotal,
    isAuthenticated,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearAllItems,
    refreshCart,

    // Loading states
    isLoading,
    isAdding,
    isFetching,
    isUpdating,
    isRemoving,
    isSyncing,
    getCart,
    // Error state
    error,

    // Raw cart states (for advanced use)
    cart: isAuthenticated ? cart : null,
    guestCart: !isAuthenticated ? guestCart : null,
  };
};
