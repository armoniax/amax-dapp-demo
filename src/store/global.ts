import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "global",
  initialState: {
    account: undefined,
    wallet: undefined,
    selectAction: undefined,
    armadilloDate: {},
  },
  reducers: {
    updateState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateArmadilloDate: (state, action) => {
      state.armadilloDate = {
        ...state.armadilloDate,
        ...action.payload,
      };
      return state;
    },
  },
});

export const { updateState, updateArmadilloDate } = counterSlice.actions;

export default counterSlice.reducer;
