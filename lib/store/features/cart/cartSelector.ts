import { RootState } from '@/lib/store/store';
import { createSelector } from 'reselect';
import { selectIsAuthenticated } from '@/lib/store/features/auth';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectGuestCart = ({ guestCart }: RootState) => guestCart;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectCart = ({ cart }: RootState) => cart;

export const selectAuthenticatedCartItemsData = createSelector(selectCart, (cart) => cart.cartData);

export const selectAuthenticatedCartItems = createSelector(
  selectAuthenticatedCartItemsData,
  (cartData) => cartData.items,
);

export const selectAuthenticatedCartTotal = createSelector(
  selectAuthenticatedCartItemsData,
  (cartData) => cartData.total,
);

export const selectGuestCartItems = createSelector(selectGuestCart, (guestCart) => guestCart.items);

export const selectGuestCartTotal = createSelector(selectGuestCartItems, (items) =>
  items.reduce((acc, item) => acc + Number(item.product.retail) * item.quantity, 0),
);

export const selectCartItems = createSelector(
  selectAuthenticatedCartItems,
  selectGuestCartItems,
  selectIsAuthenticated,
  (cartItems, guestCartItems, isAuthenticated) => (isAuthenticated ? cartItems : guestCartItems),
);

export const selectCartItemsCount = createSelector(
  selectCartItems,
  (cartItems) => cartItems.length,
);

export const selectCartTotal = createSelector(
  selectAuthenticatedCartTotal,
  selectGuestCartTotal,
  selectIsAuthenticated,
  (authenticatedCartTotal, guestCartTotal, isAuthenticated) =>
    isAuthenticated ? authenticatedCartTotal : guestCartTotal,
);
