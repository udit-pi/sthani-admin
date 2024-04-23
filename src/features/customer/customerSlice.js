import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";
import CustomerService from "../../services/customer.service";

let initialState = {
    customers: [],
    customer: {},
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
    
};

export const fetchAllCustomers = createAsyncThunk(
    "customer/fetchAllCustomers",
    async (thunkAPI) => {
      try {
        const data = await CustomerService.getCustomers();
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

  const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: { },
    extraReducers(builder) {
       
        builder.addCase(fetchAllCustomers.fulfilled, (state, action) => {
            //  console.log(action.payload)
         state.customers =  action.payload;
        
        //  state.limit = action.payload.limit;
        //  state.page = action.payload.page;
        //  state.totalPages = action.payload.totalPages;
        //  state.totalResults = action.payload.totalResults

        })

    //     builder.addCase(addCategory.fulfilled, (state, action) => {
    //       //  console.log(action.payload)
    //    state.category =  action.payload;
    //   //  state.limit = action.payload.limit;
    //   //  state.page = action.payload.page;
    //   //  state.totalPages = action.payload.totalPages;
    //   //  state.totalResults = action.payload.totalResults

    //   })

   
      
      
    }
})
export const getAllCustomers = (state) => state.customer.customers;
export default customerSlice.reducer
  