import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  count: number;
}

const initialState: CartState = {
  count: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    }
  }
});

export const { setCartCount } = cartSlice.actions;
export default cartSlice.reducer;
