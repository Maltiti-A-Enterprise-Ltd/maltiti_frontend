import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductResponseDto } from '@/app/api';
import { getBestProducts } from './productsThunk';

interface ProductsState {
  bestProducts: ProductResponseDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  bestProducts: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Best Products
      .addCase(getBestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBestProducts.fulfilled, (state, action: PayloadAction<ProductResponseDto[]>) => {
        state.loading = false;
        state.bestProducts = action.payload;
      })
      .addCase(getBestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch best products';
      });
  },
});

export default productsSlice.reducer;
