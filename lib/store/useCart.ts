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
  addToGuestCart,
  removeFromGuestCart,
  updateGuestCartQuantity,
  clearGuestCart,
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
    }
  };

  /**
   * Add item to cart
   * Routes to API or local storage based on auth status
   */
  const addItem = useCallback(
    async (product: ProductResponseDto, quantity = 1): Promise<void> => {
      if (isAuthenticated) {
        // User is logged in - use API
        await dispatch(
          addToCartAPI({
            productId: product.id,
            quantity,
          }),
        ).unwrap();
      } else {
        // Guest user - use local storage
        dispatch(addToGuestCart({ product, quantity }));
      }
    },
    [dispatch, isAuthenticated],
  );

  /**
   * Remove item from cart
   * For authenticated users, use cart item ID
   * For guests, use product ID
   */
  const removeItem = useCallback(
    async (productIdOrCartItemId: string): Promise<void> => {
      if (isAuthenticated) {
        // User is logged in - use API with cart item ID
        await dispatch(removeFromCartAPI(productIdOrCartItemId)).unwrap();
      } else {
        // Guest user - use product ID
        dispatch(removeFromGuestCart(productIdOrCartItemId));
      }
    },
    [dispatch, isAuthenticated],
  );

  /**
   * Update item quantity
   * For authenticated users, use cart item ID
   * For guests, use product ID
   */
  const updateQuantity = useCallback(
    async (productIdOrCartItemId: string, quantity: number): Promise<void> => {
      if (isAuthenticated) {
        // User is logged in - use API
        await dispatch(
          updateCartQuantityAPI({
            cartItemId: productIdOrCartItemId,
            quantity,
          }),
        ).unwrap();
      } else {
        // Guest user - use local storage
        dispatch(
          updateGuestCartQuantity({
            cartId: productIdOrCartItemId,
            quantity,
          }),
        );
      }
    },
    [dispatch, isAuthenticated],
  );

  /**
   * Clear all items from cart
   */
  const clearAllItems = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      // User is logged in - use API
      await dispatch(clearCartAPI()).unwrap();
    } else {
      // Guest user - clear local storage
      dispatch(clearGuestCart());
    }
  }, [dispatch, isAuthenticated]);

  /**
   * Refresh cart from server
   * Only applicable for authenticated users
   */
  const refreshCart = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      await dispatch(fetchCart()).unwrap();
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
   * Loading states
   */
  const isLoading = isAuthenticated
    ? cart.isLoading.add || cart.isLoading.fetch || cart.isLoading.update || cart.isLoading.remove
    : false;

  const isAdding = isAuthenticated ? cart.isLoading.add : false;
  const isFetching = isAuthenticated ? cart.isLoading.fetch : false;
  const isUpdating = isAuthenticated ? cart.isLoading.update : false;
  const isRemoving = isAuthenticated ? cart.isLoading.remove : false;
  const isSyncing = isAuthenticated ? cart.isLoading.sync : false;

  /**
   * Error states
   */
  const error = isAuthenticated
    ? cart.error.add || cart.error.fetch || cart.error.update || cart.error.remove
    : null;

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
