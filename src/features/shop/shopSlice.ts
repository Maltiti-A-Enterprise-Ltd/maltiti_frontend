import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utility/axios";
import { SERVER_ERROR } from "../../utility/constants";
import { setToast } from "../toast/toastSlice";

interface Product {
  id: number;
  name: string;
  // Add other product properties
}

interface ShopState {
  status: string;
  products: Product[];
  showError: boolean;
  errorMessage: string;
  totalPages: number;
  currentPage: number;
  bestProducts: Product[];
  statusBestProducts: string;
  product: Product | {};
  statusProduct: string;
}

const initialState: ShopState = {
  status: "idle",
  products: [],
  showError: false,
  errorMessage: "",
  totalPages: 1,
  currentPage: 1,
  bestProducts: [],
  statusBestProducts: "idle",
  product: {},
  statusProduct: "idle",
};

export const getProducts = createAsyncThunk(
  "shop/getProducts",
  async (
    {
      page = 1,
      searchTerm = "",
      category = "",
    }: { page?: number; searchTerm?: string; category?: string },
    { dispatch },
  ) => {
    try {
      const response = await axios.get(
        `/products/all-products?page=${page}&category=${category}&searchTerm=${searchTerm}`,
      );
      dispatch(updateProducts(response.data.data.products));
      dispatch(updateTotalPages(response.data.data.totalPages));
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.error || SERVER_ERROR,
        }),
      );
    }
  },
);

export const getProduct = createAsyncThunk(
  "shop/getProduct",
  async (id: number, { dispatch }) => {
    try {
      const response = await axios.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.error || SERVER_ERROR,
        }),
      );
    }
  },
);

export const getBestProducts = createAsyncThunk(
  "shop/getBestProducts",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`/products/best-products`);
      return response.data.data;
    } catch (error) {
      dispatch(
        setToast({
          type: "error",
          message: error.response?.data?.error || SERVER_ERROR,
        }),
      );
    }
  },
);

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    updateProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    updateTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    updateCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetProducts: (state) => {
      state.products = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
    toggleShowError: (state) => {
      state.showError = !state.showError;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProducts.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(getProducts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getProduct.pending, (state) => {
        state.statusProduct = "loading";
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.statusProduct = "idle";
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state) => {
        state.statusProduct = "failed";
      })
      .addCase(getBestProducts.pending, (state) => {
        state.statusBestProducts = "loading";
      })
      .addCase(getBestProducts.fulfilled, (state, action) => {
        state.statusBestProducts = "idle";
        state.bestProducts = action.payload;
      })
      .addCase(getBestProducts.rejected, (state) => {
        state.statusBestProducts = "failed";
      });
  },
});

export const {
  updateProducts,
  updateTotalPages,
  updateCurrentPage,
  resetProducts,
  toggleShowError,
} = shopSlice.actions;

export default shopSlice.reducer;
