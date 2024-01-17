import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productSlice from "./productSlice";
const store = configureStore({
  reducer: {
    allCart: cartReducer,
    productSlice: productSlice,
  },
});

export default store;
