import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '../../services/inventory.service';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk('inventory/fetchProducts', async () => {
  const response = await inventoryService.fetchProducts();
  console.log(response);
  return response;
});

// Async thunk for updating product stock
export const updateProductStock = createAsyncThunk('inventory/updateProductStock', async (data, thunkAPI) => {
  try {
    const response = await inventoryService.updateProductStock(data);
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Async thunk for bulk updating product stock
export const bulkUpdateProductStock = createAsyncThunk('inventory/bulkUpdateProductStock', async (file, thunkAPI) => {
  try {
    const response = await inventoryService.bulkUpdateProductStock(file);
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// in inventorySlice.js
export const selectLowStockItems = (state) => state.inventory.items.filter(item => item.stock < 20);


const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        // Update state with new stock value if needed
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bulkUpdateProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        // Update state with new stock values if needed
      })
      .addCase(bulkUpdateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;
