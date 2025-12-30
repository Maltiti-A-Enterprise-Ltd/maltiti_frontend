import { configureStore } from "@reduxjs/toolkit";
import shopReducer from "../src/features/shop/shopSlice.ts";
import userReducer from "../src/features/user/userSlice.ts";
import toastReducer from "../src/features/toast/toastSlice.ts";
import cartReducer from "../src/features/cart/cartSlice.ts";

const store = configureStore({
  reducer: {
    shop: shopReducer,
    user: userReducer,
    toast: toastReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
