import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { logout } from "../features/auth/authSlice";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user: currentUser } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn || checkTokenExpiry()) {
      console.log('Token expired or user not logged in');
      dispatch(logout());
    }
  }, [dispatch, isLoggedIn, currentUser]);

  const checkTokenExpiry = () => {
    const tokenExpiration = currentUser?.tokens?.access?.expires;
    if (tokenExpiration) {
      return new Date(tokenExpiration) <= new Date();
    }
    return false;
  };

  const isAuthenticated = () => {
    return isLoggedIn && !checkTokenExpiry();
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
