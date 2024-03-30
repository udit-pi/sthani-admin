import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import categoryReducer from '../features/category/categorySlice'
import brandReducer from '../features/brand/brandSlice'
import productSlice from '../features/product/productSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productSlice
  },
});
