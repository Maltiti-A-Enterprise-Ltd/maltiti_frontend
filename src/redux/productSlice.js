import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utility/axios.js";
import { toast } from "react-toastify";

export const showSuccessMessage = (message) => ({
  type: "products/showSuccessMessage",
  payload: message,
});

export const showErrorMessage = (message) => ({
  type: "products/showErrorMessage",
  payload: message,
});

//Fetch featured products data
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { dispatch }) => {
    try {
      const res = await axios.get(`/products/best-products`);
      const data = res.data.data.data;
      dispatch(setProducts(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
);

//fetch All products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = { page: 1, searchTerm: "" }, { dispatch }) => {
    const { page, searchTerm } = params;
    try {
      const response = await axios.get(
        `/products/all-products?page=${page}&searchTerm=${searchTerm}`
      );
      const data = response.data.data.products;
      dispatch(setProducts(data));
      return data;
    } catch (error) {
      toast.error("Error searching products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    tabs: [
      { name: "All", value: "All" },
      { name: "Shea butter", value: "Shea butter" },
      { name: "Soap", value: "Soap" },
      { name: "Essential Oils", value: "Essential Oils" },
      { name: "Others", value: "Others" },
    ],
    status: "idle",
    error: null,
    loading: false,
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

      //Featured Products Reducers
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.snackbarMessage = "Error loading products";
      })

      // All Products Reducers
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.snackbarMessage = "Error loading tabs data";
      });
  },
});

export const { setProducts, clearSnackbarMessage } = productSlice.actions;
export default productSlice.reducer;
