import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utility/axios.js";

export const showSuccessMessage = (message) => ({
  type: "products/showSuccessMessage",
  payload: message,
});

export const showErrorMessage = (message) => ({
  type: "products/showErrorMessage",
  payload: message,
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const res = await axios.get(`/products/best-products`);
      const data = res.data.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    loading: true,
    snackbarMessage: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    clearSnackbarMessage: (state) => {
      state.snackbarMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.snackbarMessage = "Error loading products";
      });
  },
});

export const { setProducts, clearSnackbarMessage } = productSlice.actions;
export default productSlice.reducer;
