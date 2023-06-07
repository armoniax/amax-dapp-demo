import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "global",
  initialState: {
    account: undefined,
    wallet: undefined,
    selectAction: undefined,
  },
  reducers: {
    updateState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateState } = counterSlice.actions;

export default counterSlice.reducer;
