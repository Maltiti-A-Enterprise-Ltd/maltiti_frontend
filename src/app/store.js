import { configureStore } from "@reduxjs/toolkit";
import shopReducer from "../features/shop/shopSlice";
import userReducer from "../features/user/userSlice";
import toastReducer from "../features/toast/toastSlice";
import cartReducer from "../features/cart/cartSlice";

const store = configureStore({
  reducer: {
    shop: shopReducer,
    user: userReducer,
    toast: toastReducer,
    cart: cartReducer,
  },
});

export default store;
