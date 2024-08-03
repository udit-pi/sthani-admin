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
  error: null,
  validationResults: [], // Initialize validationResults
  isValid: false // Initialize isValid

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

export const importProducts = createAsyncThunk('product/importProducts', async (products, thunkAPI) => {
  try {
    const data = await ProductService.importProducts(products);
    return data;
  } catch (error) {
    const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message); 
    }
});



export const validateProductsImport = createAsyncThunk('product/validateProductsImport', async ({ file, shouldImport = false }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await ProductService.validateProducts(formData, shouldImport);
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});


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

export const fetchProductsByBrand = createAsyncThunk(
  'products/fetchByBrand',
  async ({ brandId }, thunkAPI) => {
    try {
      const response = await ProductService.getProductsByBrand(brandId);
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
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
      })
      .addCase(validateProductsImport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationResults = [];
        state.isValid = false;
      })
      .addCase(validateProductsImport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.meta.arg.shouldImport) {
          state.importResults = action.payload.importResults;
        } else {
          state.validationResults = action.payload.validationResults;
          state.isValid = action.payload.isValid;
        }
        state.isLoading = false;
      })
      .addCase(validateProductsImport.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.validationResults = [];
        state.isValid = false;
      })
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});


export const getAllProducts = (state) => state.product.products;
export const getProduct = (state) => state.product.product;
export default productSlice.reducer