import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductResponseDto, productsControllerGetBestProducts } from '@/app/api';

export const getBestProducts = createAsyncThunk(
  'products/getBestProducts',
  async (): Promise<ProductResponseDto[]> => {
    try {
      const { data } = await productsControllerGetBestProducts();
      return data?.data.data ?? [];
    } catch (error) {
      throw new Error(String(error));
    }
  },
);
