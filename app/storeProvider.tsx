'use client';
import { ReactNode, JSX } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/lib/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Loader } from '@/components/ui/loader';

export default function StoreProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
