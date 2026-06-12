import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { SessionUser } from "@/types";

interface AuthState {
  user: SessionUser | null;
}

const initialState: AuthState = {
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SessionUser | null>) {
      state.user = action.payload;
    }
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
