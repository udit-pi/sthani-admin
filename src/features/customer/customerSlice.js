import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";
import CustomerService from "../../services/customer.service";

// Define initial state
let initialState = {
    customers: [],
    customer: {},
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null
};

// Async thunk to fetch all customers
export const fetchAllCustomers = createAsyncThunk(
    "customer/fetchAllCustomers",
    async (_, thunkAPI) => {
        try {
            const response = await CustomerService.getCustomers();
            
            
            return response;  // Assuming the response contains data in 'data' property

            
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async thunk to fetch a customer by ID
export const fetchAllCustomersById = createAsyncThunk(
    "customer/fetchAllCustomersById",
    async ({ id }, thunkAPI) => {
        try {
            const response = await CustomerService.getCustomersById(id);
            return response;  // Assuming the response contains data in 'data' property
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload || []; // Adjust according to your response structure
                state.page = action.payload.page || 1;
                state.totalPages = action.payload.totalPages || 1;
                state.totalResults = action.payload.totalResults || 0;
            })
            .addCase(fetchAllCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllCustomersById.fulfilled, (state, action) => {
                state.customer = action.payload || {};
            })
            .addCase(fetchAllCustomersById.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

// Selector to get all customers
export const getAllCustomers = (state) => state.customer.customers;

export default customerSlice.reducer;
