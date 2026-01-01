import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/productsSlice';
import authReducer from './features/auth/authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  products: productsReducer,
  auth: persistReducer(authPersistConfig, authReducer),
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
