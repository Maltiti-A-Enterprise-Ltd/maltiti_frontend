'use client';
import { ReactNode, JSX, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/lib/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Loader } from '@/components/ui/loader';
import { setupInterceptors } from '@/lib/api';

export default function StoreProvider({ children }: { children: ReactNode }): JSX.Element {
  useEffect(() => {
    // Initialize API interceptors when the app loads
    setupInterceptors();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
