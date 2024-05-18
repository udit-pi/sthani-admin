import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";
import DiscountService from "../../services/discount.service";

let initialState = {
    discounts: [],
    discount: {},
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
    
};

export const fetchAllDiscount = createAsyncThunk(
    "discount/fetchAllDiscount",
    async (thunkAPI) => {
      try {
        const data = await DiscountService.getDiscount();
      //   thunkAPI.dispatch(setMessage(data.message));
      console.log(data)
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


  export const fetchDiscountById = createAsyncThunk(
    "discount/FetchDiscountById",
    async ({id},thunkAPI) => {
      try {
        const data = await DiscountService.getDiscountById(id);
      //   thunkAPI.dispatch(setMessage(data.message));
      console.log(data)
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
  export const UpdateDiscountById = createAsyncThunk(
    "discount/UpdateDiscountById",
    async ({id,values},thunkAPI) => {
      try {
        const data = await DiscountService.updateDiscountById(id,values);
      //   thunkAPI.dispatch(setMessage(data.message));
      console.log(data)
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

  export const addDiscount = createAsyncThunk(
    "discount/addDiscount",
    async (DiscountData,thunkAPI) => {
      try {
      //  console.log(catData)
        const res = await DiscountService.saveDiscount(DiscountData);
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


export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async ({id},thunkAPI) => {
    try {
    //   console.log(id)
    //  console.log(updateData)
      const res = await DiscountService.deleteDiscountById(id);
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




  const DiscountSlice = createSlice({
    name: 'discount',
    initialState,
    reducers: { },
    extraReducers(builder) {
       
        builder.addCase(fetchAllDiscount.fulfilled, (state, action) => {
            //  console.log(action.payload)
         state.discounts =  action.payload;
        
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults

        })

        builder.addCase(fetchDiscountById.fulfilled, (state, action) => {
          
       state.discount =  action.payload;
    //   //  state.limit = action.payload.limit;
    //   //  state.page = action.payload.page;
    //   //  state.totalPages = action.payload.totalPages;
    //   //  state.totalResults = action.payload.totalResults

      })

   
      
      
    }
})
export const getAlldiscount = (state) => state.discount.discounts;
export default DiscountSlice.reducer
  