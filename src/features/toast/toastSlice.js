/* eslint-disable no-param-reassign,no-use-before-define */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  message: "",
  type: "info",
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state, action) => {
      const { message, type } = action.payload;
      state.message = message;
      state.type = type;
      state.isOpen = true;
    },
    resetToast: (state, action) => {
      state.message = "";
      state.isOpen = false;
    },
  },
});

export const { setToast, resetToast } = toastSlice.actions;

export default toastSlice.reducer;
