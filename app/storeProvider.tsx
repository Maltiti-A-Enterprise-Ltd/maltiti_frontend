'use client';
import { useState, ReactNode, JSX } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store/store';

export default function StoreProvider({ children }: { children: ReactNode }): JSX.Element {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
