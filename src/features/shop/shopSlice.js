/* eslint-disable no-param-reassign,no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utility/axios';
import { SERVER_ERROR } from '../../utility/constants';

const initialState = {
  status: 'idle',
  products: [],
  showError: false,
  errorMessage: '',
  totalPages: 1,
  currentPage: 1,
  bestProducts: [],
  statusBestProducts: 'idle',
  product: {},
  statusProduct: 'idle'
};

export const getProducts = createAsyncThunk(
  'shop/getProducts',
  async ({ page = 1, searchTerm = '', category = '' }, { dispatch }) => {
    try {
      const response = await axios.get(
        `/products/all-products?page=${page}&category=${category}&searchTerm=${searchTerm}`
      );
      dispatch(updateProducts(response.data.data.products));
      dispatch(updateTotalPages(response.data.data.totalPages));
    } catch (error) {
      dispatch(toggleShowError(error.error.message));
    }
  }
);

export const getProduct = createAsyncThunk('shop/getProduct', async (id, { dispatch }) => {
  try {
    const response = await axios.get(`/products/product/${id}`);
    dispatch(updateProduct(response.data.data));
  } catch (error) {
    dispatch(toggleShowError(error.error.message));
  }
});

export const getBestProducts = createAsyncThunk('shop/getBestProducts', async (_, { dispatch }) => {
  try {
    const response = await axios.get(`/products/best-products`);
    dispatch(updateBestProducts(response.data.data.data));
    dispatch(resetProducts());
  } catch (error) {
    dispatch(toggleShowError(error.error.message));
  }
});

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    updateProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    updateProduct: (state, action) => {
      state.product = action.payload;
    },
    resetProducts: (state) => {
      state.products = [];
    },
    updateBestProducts: (state, action) => {
      state.bestProducts = action.payload;
    },
    toggleShowError: (state, action) => {
      state.showError = !state.showError;
      state.errorMessage = action.payload || SERVER_ERROR;
    },
    updateTotalPages: (state, action) => {
      return {
        ...state,
        totalPages: action.payload
      };
    },
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state) => {
      state.status = 'success';
    });
    builder.addCase(getProducts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.status = 'error';
    });
    builder.addCase(getBestProducts.fulfilled, (state) => {
      state.statusBestProducts = 'success';
    });
    builder.addCase(getBestProducts.pending, (state) => {
      state.statusBestProducts = 'loading';
    });
    builder.addCase(getBestProducts.rejected, (state) => {
      state.statusBestProducts = 'error';
    });
    builder.addCase(getProduct.fulfilled, (state) => {
      state.statusProduct = 'success';
    });
    builder.addCase(getProduct.pending, (state) => {
      state.statusProduct = 'loading';
    });
    builder.addCase(getProduct.rejected, (state) => {
      state.statusProduct = 'error';
    });
  }
});

export const {
  updateProducts,
  updateCurrentPage,
  updateBestProducts,
  toggleShowError,
  updateTotalPages,
  resetProducts,
  updateProduct
} = shopSlice.actions;

export default shopSlice.reducer;
