import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OrderService from '../../services/order.service';
import { toast } from 'react-toastify';

// Async thunks for fetching orders and order details
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  return await OrderService.getOrders();
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id) => {
  return await OrderService.getOrderById(id);
});

// Async thunks for updating order status
export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ id, status }) => {
  return await OrderService.updateOrderStatus(id, status);
});

// Async thunk for deleting an order
export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
  return await OrderService.deleteOrder(id);
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.currentOrder = {
          ...state.currentOrder,
          status: action.payload.status,
        };
        toast.success('Order status updated successfully!');
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        toast.error('Failed to update order status');
      });
  },
});

export default orderSlice.reducer;
