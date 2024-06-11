import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ShippingRateService from '../../services/shippingrate.service';

// Async thunk for fetching shipping rates
export const fetchShippingRates = createAsyncThunk('shippingRates/fetchShippingRates', async () => {
  return await ShippingRateService.getShippingRates();
});


// Async thunk for adding a new shipping rate
export const addShippingRate = createAsyncThunk('shippingRates/addShippingRate', async (shippingRate, { rejectWithValue }) => {
    try {
      return await ShippingRateService.saveShippingRate(shippingRate);
    } catch (err) {
      return rejectWithValue(err);
    }
  });

// Async thunk for updating a shipping rate
export const updateShippingRate = createAsyncThunk('shippingRates/updateShippingRate', async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      return await ShippingRateService.updateShippingRateById(id, updatedData);
    } catch (err) {
      return rejectWithValue(err);
    }
  });

// Async thunk for deleting a shipping rate
export const deleteShippingRate = createAsyncThunk('shippingRates/deleteShippingRate', async (id) => {
  await ShippingRateService.deleteShippingRateById(id);
  return id;
});

const shippingRateSlice = createSlice({
  name: 'shippingRates',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippingRates.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchShippingRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addShippingRate.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteShippingRate.fulfilled, (state, action) => {
        state.items = state.items.filter(rate => rate._id !== action.payload);
      })
      .addCase(updateShippingRate.fulfilled, (state, action) => {
        const index = state.items.findIndex(rate => rate._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default shippingRateSlice.reducer;
