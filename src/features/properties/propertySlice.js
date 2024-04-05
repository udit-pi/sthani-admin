import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";
import PropertyService from "../../services/property.service";

let initialState = {
    properties: [],
    property: {},
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
    
  };


  export const fetchAllProperties = createAsyncThunk(
    "property/fetchAllProperties",
    async (thunkAPI) => {
      try {
        const data = await PropertyService.getProperties();
      //   thunkAPI.dispatch(setMessage(data.message));
      // console.log(data)
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

  export const addProperty = createAsyncThunk(
    "property/addProperty",
    async (propertyData,thunkAPI) => {
      try {
      //  console.log(catData)
        const res = await PropertyService.saveProperty(propertyData);
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

export const fetchPropertyById = createAsyncThunk(
  "property/fetchProperty",
  async ({id},thunkAPI) => {
    try {
     
      const data = await PropertyService.getProperty(id);
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

export const updateProperty = createAsyncThunk(
  "property/updateProperty",
  async ({id,values},thunkAPI) => {
    try {
     
      const data = await PropertyService.updatePropertyById(id,values);
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

export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async ({id},thunkAPI) => {
    try {
    //   console.log(id)
    //  console.log(updateData)
      const res = await PropertyService.deletePropertyById(id);
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



  const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: { },
    extraReducers(builder) {
       
        builder.addCase(fetchAllProperties.fulfilled, (state, action) => {
            //  console.log(action.payload)
         state.properties =  action.payload;
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults

        })

        builder.addCase(addProperty.fulfilled, (state, action) => {
          //  console.log(action.payload)
         state.property =  action.payload;
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults
  
        })

        builder.addCase(fetchPropertyById.fulfilled, (state, action) => {
          //  console.log(action.payload)
         state.property =  action.payload;
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults
  
        })

        builder.addCase(updateProperty.fulfilled, (state, action) => {
          //  console.log(action.payload)
         state.property =  action.payload;
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults
  
        })
    }
    })

    export const getAllProperties = (state) => state.property.properties;
export const getProperty = (state) => state.property.property;
export default propertySlice.reducer