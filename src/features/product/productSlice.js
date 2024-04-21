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
    
  };

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
  async ({id},thunkAPI) => {
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
  async (values,thunkAPI) => {
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
  async ({id,values},thunkAPI) => {
    try {
     
      // console.log(updatedValues)
     
      const data = await ProductService.updateProduct(id,values);
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



const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: { },
    extraReducers(builder) {
       
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
            //  console.log(action.payload)
         state.products =  action.payload;
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults

        })

        builder.addCase(fetchProductById.fulfilled, (state, action) => {
          //  console.log(action.payload)
       state.product =  action.payload;
      //  state.limit = action.payload.limit;
      //  state.page = action.payload.page;
      //  state.totalPages = action.payload.totalPages;
      //  state.totalResults = action.payload.totalResults

      })

   
      
    }
})
export const getAllProducts = (state) => state.product.products;
export const getProduct = (state) => state.product.product;
export default productSlice.reducer