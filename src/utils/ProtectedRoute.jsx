import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router-dom';
import { logout } from "../features/auth/authSlice";

const ProtectedRoute = ({ component: Component, ...rest }) => {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const { user: currentUser } = useSelector((state) => state.auth);

  const checkTokenExpiry = () => {
    const tokenExpiration = currentUser?.tokens?.access?.expires;
    if (tokenExpiration) {
      const expirationTime = new Date(tokenExpiration);
      return expirationTime <= new Date(); // Token has expired
    }
    return false; // Token is still valid
  };



  useEffect(() => {
    const interval = setInterval(() => {
      if (checkTokenExpiry()) {
        console.log('Token expired');
        dispatch(logout());
      }
    }, 1000); // Check token expiry every second

    return () => clearInterval(interval);
  }, [dispatch, currentUser]);




  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const expirationTime = currentUser?.tokens.access.expires;
    // console.log(token)
    return token && expirationTime && new Date(expirationTime) > new Date();
  };


  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  if (window.location.pathname === '/') {
    return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />


};

export default ProtectedRoute;