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
  async (catData, thunkAPI) => {
    try {
      const res = await CategoryService.saveCategory(catData);
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
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

// Define the thunk for validating and importing categories
export const validateCategoriesImport = createAsyncThunk('category/validateCategoriesImport', async ({ file, shouldImport = false }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await CategoryService.validateCategories(formData, shouldImport);
    

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

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.category = action.payload;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload; // Set the error state
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.category = action.payload;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.category = action.payload;
      })
      .addCase(validateCategoriesImport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(validateCategoriesImport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.meta.arg.shouldImport) {
          state.importResults = action.payload.importSummary;
        } else {
          state.validationResults = action.payload.validationResults;
          state.isValid = action.payload.isValid;
        }
      })
      .addCase(validateCategoriesImport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const getAllCategories = (state) => state.category.categories;
export const getCategoryError = (state) => state.category.error;

export default categorySlice.reducer