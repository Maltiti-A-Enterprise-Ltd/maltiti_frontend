import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToastState {
  type: string;
  message: string;
  open: boolean;
  backDrop: boolean;
}

const initialState: ToastState = {
  type: "",
  message: "",
  open: false,
  backDrop: false,
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (
      state,
      action: PayloadAction<{ type: string; message: string }>,
    ) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.open = true;
    },
    closeToast: (state) => {
      state.open = false;
    },
    openBackDrop: (state) => {
      state.backDrop = true;
    },
    closeBackDrop: (state) => {
      state.backDrop = false;
    },
    openModal: (
      state,
      action: PayloadAction<{ message: string; image: string }>,
    ) => {
      // Add modal logic if needed
    },
  },
});

export const { setToast, closeToast, openBackDrop, closeBackDrop, openModal } =
  toastSlice.actions;

export default toastSlice.reducer;
