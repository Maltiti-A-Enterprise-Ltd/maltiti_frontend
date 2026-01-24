import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/productsSlice';
import authReducer from './features/auth/authSlice';
import { cartReducer, guestCartReducer } from './features/cart';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist config for auth - only persist user data
const authPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'accessToken'],
};

// Persist config for guest cart - persist all guest cart data
const guestCartPersistConfig = {
  key: 'guestCart',
  storage,
  whitelist: ['items', 'totalItems', 'totalPrice'],
};

const rootReducer = combineReducers({
  products: productsReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  cart: cartReducer,
  guestCart: persistReducer(guestCartPersistConfig, guestCartReducer),
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          ignoredPaths: [],
        },
      }),
  });

// Create a single store instance
export const store = makeStore();
export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
