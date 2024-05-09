/* eslint-disable no-param-reassign,no-use-before-define */
import { createSlice } from "@reduxjs/toolkit";
import { imagePaths } from "../../utility/constants";

const initialState = {
  isOpen: false,
  message: "",
  type: "info",
  isBackDropOpen: false,
  isModalOpen: false,
  modalData: {
    image: imagePaths.mailBox,
    message: "We have sent you a reset mail to your email",
  },
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
    openBackDrop: (state) => {
      state.isBackDropOpen = true;
    },
    closeBackDrop: (state) => {
      state.isBackDropOpen = false;
    },
    openModal: (state, action) => {
      state.modalData = action.payload;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const {
  setToast,
  resetToast,
  openBackDrop,
  closeBackDrop,
  closeModal,
  openModal,
} = toastSlice.actions;

export default toastSlice.reducer;
