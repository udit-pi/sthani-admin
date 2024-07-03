import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";

import CategoryService from "../../services/category.service";
import ProductService from "../../services/product.service";


let initialState = {
  products: [],
  product: {},
  page: 1,
  limit: 10,
  totalPages: 1,
  totalResults: 1,
  syncResults: null, 
  isLoading: false,
  error: null

};

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async ({ id }, thunkAPI) => {
    try {
      const data = await ProductService.deleteProduct(id);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (thunkAPI) => {
    try {
      const data = await ProductService.getProducts();
      //   thunkAPI.dispatch(setMessage(data.message));
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProduct",
  async ({ id }, thunkAPI) => {
    try {

      const data = await ProductService.getProduct(id);
      //   thunkAPI.dispatch(setMessage(data.message));
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (values, thunkAPI) => {
    try {

      const data = await ProductService.saveProduct(values);
      //   thunkAPI.dispatch(setMessage(data.message));
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, values }, thunkAPI) => {
    try {
      const data = await ProductService.updateProduct(id, values);
      return data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); 
    }
  }
);

export const syncProductsWithIQ = createAsyncThunk(
  "product/syncProductsWithIQ",
  async (_, thunkAPI) => {
    try {
      const response = await ProductService.syncProductsIQ();
     // console.log("Response from syncProductsIQ:", response);  // Ensure you're logging the right response

      // Check for response success status
      if (response.success) {
        thunkAPI.dispatch(setMessage('Products synced successfully'));
        // Return the data part directly from the response
        return response.data;
      } else {
        // Handle non-successful responses by dispatching a message and rejecting with value
        const errMsg = response.message || 'Failed to sync products';
        thunkAPI.dispatch(setMessage(errMsg));
        return thunkAPI.rejectWithValue(errMsg);
      }
    } catch (error) {
      // Detailed error handling and logging
      let errMsg = 'Unknown error syncing products';
      if (error.response && error.response.data) {
        errMsg = error.response.data.message || JSON.stringify(error.response.data, null, 2);
      } else if (error.message) {
        errMsg = error.message;
      }
      console.error("Sync Error:", errMsg);
      thunkAPI.dispatch(setMessage(errMsg));
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);



const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(syncProductsWithIQ.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.syncResults = null;  // Reset sync results on new sync
      })
      .addCase(syncProductsWithIQ.fulfilled, (state, action) => {
        state.syncResults = action.payload;  // Expect action.payload to contain { created, updated }
        state.isLoading = false;
      })
      .addCase(syncProductsWithIQ.rejected, (state, action) => {
        state.error = action.payload;  // Error message or object
        state.isLoading = false;
        state.syncResults = null;  // Ensure clean state on error
      });
  }
});


export const getAllProducts = (state) => state.product.products;
export const getProduct = (state) => state.product.product;
export default productSlice.reducer