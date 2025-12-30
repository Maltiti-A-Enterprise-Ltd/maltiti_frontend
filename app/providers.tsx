"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "../src/features/user/userSlice.ts";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
