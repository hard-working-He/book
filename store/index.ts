import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/auth-slice";
import cartReducer from "@/store/slices/cart-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
