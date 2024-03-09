import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../features/shop/shopSlice';

const store = configureStore({
  reducer: {
    shop: shopReducer
  }
});

export default store;
