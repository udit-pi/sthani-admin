import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";

import CategoryService from "../../services/category.service";

let initialState = {
    categories: [],
    category: {},
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
    
  };

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (thunkAPI) => {
    try {
      const data = await CategoryService.getCategories();
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

export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategory",
  async ({id},thunkAPI) => {
    try {
     
      const data = await CategoryService.getCategory(id);
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

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (catData,thunkAPI) => {
    try {
    //  console.log(catData)
      const res = await CategoryService.saveCategory(catData);
    //   thunkAPI.dispatch(setMessage(data.message));
      return res;
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

export const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({id,updateData},thunkAPI) => {
    try {
    //   console.log(id)
    //  console.log(updateData)
      const res = await CategoryService.updateCategory(id,updateData);
    //   thunkAPI.dispatch(setMessage(data.message));
      return res;
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

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({id},thunkAPI) => {
    try {
    //   console.log(id)
    //  console.log(updateData)
      const res = await CategoryService.deleteCategoryById(id);
    //   thunkAPI.dispatch(setMessage(data.message));
      return res;
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


const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: { },
    extraReducers(builder) {
       
        builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
            //  console.log(action.payload)
         state.categories =  action.payload;
        
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults

        })

        builder.addCase(addCategory.fulfilled, (state, action) => {
          //  console.log(action.payload)
       state.category =  action.payload;
      //  state.limit = action.payload.limit;
      //  state.page = action.payload.page;
      //  state.totalPages = action.payload.totalPages;
      //  state.totalResults = action.payload.totalResults

      })

      
      builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
        //  console.log(action.payload)
     state.category =  action.payload;
    //  state.limit = action.payload.limit;
    //  state.page = action.payload.page;
    //  state.totalPages = action.payload.totalPages;
    //  state.totalResults = action.payload.totalResults

      })
      builder.addCase(editCategory.fulfilled, (state, action) => {
        //  console.log(action.payload)
     state.category =  action.payload;
    //  state.limit = action.payload.limit;
    //  state.page = action.payload.page;
    //  state.totalPages = action.payload.totalPages;
    //  state.totalResults = action.payload.totalResults

      })
      
    }
})
export const getAllCategories = (state) => state.category.categories;
export default categorySlice.reducer