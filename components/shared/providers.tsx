"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "@/store";
import type { SessionUser } from "@/types";

export function Providers(props: {
  children: ReactNode;
  user: SessionUser | null;
  cartCount: number;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore({
      auth: { user: props.user },
      cart: { count: props.cartCount }
    });
  }

  return <Provider store={storeRef.current}>{props.children}</Provider>;
}
