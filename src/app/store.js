import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import categoryReducer from '../features/category/categorySlice'
import brandReducer from '../features/brand/brandSlice'
import productSlice from '../features/product/productSlice'
import propertySlice from '../features/properties/propertySlice';
import customerSlice from '../features/customer/customerSlice';
import shippingrateSlice from '../features/shippingrate/shippingrateSlice';
import orderSlice from '../features/order/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productSlice,
    property: propertySlice,
    customer: customerSlice,
    shippingRates: shippingrateSlice,
    orders: orderSlice
  },
});
