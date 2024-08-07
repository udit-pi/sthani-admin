import React, { Fragment } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import Home from "./pages/Home";
import Users from "./pages/Users";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import Category from "./pages/Category/Category";
import ShowCategory from "./pages/Category/ShowCategory";
import EditCategory from "./pages/Category/EditCategory";
import AddCategory from "./pages/Category/AddCategory";
import CategoryImport from "./pages/Category/CategoryImport";
import { ToastContainer } from "react-toastify";
import Brand from "./pages/Brand/Brand";
import AddBrand from "./pages/Brand/AddBrand";
import ShowBrand from "./pages/Brand/ShowBrand";
import EditBrand from "./pages/Brand/EditBrand";
import BrandImport from "./pages/Brand/BrandImport";
import Product from "./pages/Product/Product";
import ProductImport from "./pages/Product/ProductImport";
import ShowProduct from "./pages/Product/ShowProduct";
import AddProduct from "./pages/Product/AddProduct";
import Properties from "./pages/Properties/Properties";
import AddProperty from "./pages/Properties/AddProperty";
import EditProperty from "./pages/Properties/EditProperty";
import EditProduct from "./pages/Product/EditProduct";
import  Customer  from "./pages/Customer/Customer";
import CustomerDetails from "./pages/Customer/CustomerDetails";
import CreateHomeWidget from "./pages/Home/CreateHomeWidget";
import HomeWidget from "./pages/Home/HomeWidget";
import EditHomeWidget from "./pages/Home/EditHomeWidget";
import AddProductNew from "./pages/Product/AddProductNew";
import EditProductNew from "./pages/Product/EditProductNew";
import Discount from "./pages/Discount/Discount";
import AddDiscount from "./pages/Discount/AddDiscount";
import EditDiscount from "./pages/Discount/EditDiscount";
import ShippingRate from "./pages/ShippingRate";
import OrderList from './pages/Order/OrderList';
import OrderDetails from './pages/Order/OrderDetails';
import Inventory from './pages/Inventory';

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/users" element={<ProtectedRoute />}>
            <Route exact path="/users" element={<Users />} />
          </Route>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route exact path="/dashboard" element={<Home />} />

            {/* Category Routes */}
            <Route exact path="/category" element={<Category />} />
            <Route exact path="/addcategory" element={<AddCategory />} />
            <Route exact path="/showcategory/:id" element={<ShowCategory />} />
            <Route path="/editcategory/:id" element={<EditCategory />} />
            <Route exact path="/categoryimport" element={<CategoryImport />} />

            {/* Brand Routes */}
            <Route exact path="/brand" element={<Brand />} />
            <Route exact path="/addbrand" element={<AddBrand />} />
            <Route exact path="/showbrand/:id" element={<ShowBrand />} />
            <Route exact path="/editbrand/:id" element={<EditBrand />} />
            <Route exact path="/brandimport" element={<BrandImport />} />

            {/* Product Routes */}
            <Route exact path="/product" element={<Product />} />
            <Route exact path="/showproduct/:id" element={<ShowProduct />} />
            <Route exact path="/addproduct" element={<AddProduct />} />     
            {/* <Route exact path="/editproduct/:id" element={<EditProduct />} /> */}
            <Route exact path="/editproduct/:id?" element={<EditProduct />} />
            <Route exact path="/productimport" element={<ProductImport />} />

             {/* Product Routes */}
            <Route exact path="/properties" element={<Properties />} />
            <Route exact path="/addproperty" element={<AddProperty />} />
            <Route exact path="/editProperty/:id" element={<EditProperty />} />

            {/* Customer Routes */}
            <Route exact path="/customers" element={<Customer />} />
            <Route exact path="/customer/:id" element={<CustomerDetails/>} />

             {/* Home Widget Route */}
             <Route exact path="/homePage" element={<HomeWidget />} />
            <Route exact path="/addWidget" element={<CreateHomeWidget />} />
            <Route exact path="/editWidget/:id" element={<EditHomeWidget />} />
            
            {/* Discount Route */}

            <Route exact path="/discount" element={<Discount />} />
            <Route exact path="/addDiscount" element={<AddDiscount/>} />
            <Route exact path="/editDiscount/:id" element={<EditDiscount />} />

            <Route exact path="/shippingRate" element={<ShippingRate />} />
            
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />

            <Route path="/inventory" element={<Inventory />} />

          </Route>
        </Routes>
        <ToastContainer />
      </Fragment>
    </Router>
  );
}

export default App;
