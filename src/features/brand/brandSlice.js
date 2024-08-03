import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";
import BrandService from "../../services/brand.service";

// import CategoryService from "../../services/category.service";

let initialState = {
    brands: [],
    brand: {},
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
    
  };

export const fetchAllBrands = createAsyncThunk(
  "brand/fetchAllBrands",
  async (thunkAPI) => {
    try {
      const data = await BrandService.getBrands();
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

export const addBrand = createAsyncThunk(
    "brand/addBrand",
    async (brandData,thunkAPI) => {
      try {
      //  console.log(catData)
        const res = await BrandService.saveBrand(brandData);
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

export const fetchBrandById = createAsyncThunk(
  "brand/fetchBrand",
  async ({id},thunkAPI) => {
    try {
     
      const data = await BrandService.getBrand(id);
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

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({id,values},thunkAPI) => {
    try {
     
      const data = await BrandService.updateBrandById(id,values);
    //   thunkAPI.dispatch(setMessage(data.message));
    console.log(data);
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

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async ({id},thunkAPI) => {
    try {
    //   console.log(id)
    //  console.log(updateData)
      const res = await BrandService.deleteBrandById(id);
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

// Define the thunk for validating and importing brands
export const validateBrandsImport = createAsyncThunk('brand/validateBrandsImport', async ({ file, shouldImport = false }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await BrandService.validateBrands(formData, shouldImport); // Use BrandService
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


const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: { },
    extraReducers(builder) {
       
        builder.addCase(fetchAllBrands.fulfilled, (state, action) => {
            //  console.log(action.payload)
         state.brands =  action.payload;
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults

        })

        builder.addCase(fetchBrandById.fulfilled, (state, action) => {
        //  console.log(action.payload)
       state.brand =  action.payload;
      //  state.limit = action.payload.limit;
      //  state.page = action.payload.page;
      //  state.totalPages = action.payload.totalPages;
      //  state.totalResults = action.payload.totalResults

      })

      builder.addCase(validateBrandsImport.pending, (state) => {
        state.status = 'loading';
      })
      builder.addCase(validateBrandsImport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.validationResults = action.payload.validationResults;
        state.isValid = action.payload.isValid;
      })
      builder.addCase(validateBrandsImport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

      
    }
})

export const getAllBrands = (state) => state.brand.brands;
export const getBrand = (state) => state.brand.brand;
export default brandSlice.reducer
