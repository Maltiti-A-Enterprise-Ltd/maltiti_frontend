// src/components/cards/store.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../../reducers/products.js";

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;
