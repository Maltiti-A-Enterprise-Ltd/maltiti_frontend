import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsControllerGetBestProducts } from '@/app/api';
import { getErrorMessage } from '@/lib/utils';

export const getBestProducts = createAsyncThunk(
  'products/getBestProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await productsControllerGetBestProducts({
        // Skip products with no picture — the homepage strip is all imagery,
        // and a placeholder tile there reads as a broken site.
        query: { hasImage: true },
      });

      if (!data || error) {
        return rejectWithValue(getErrorMessage(error, 'Failed to fetch best products.'));
      }

      return data?.data.data ?? [];
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch best products.'));
    }
  },
);
