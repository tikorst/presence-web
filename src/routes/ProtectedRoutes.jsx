import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const isAuthenticated = () => {
    return Cookies.get('token'); // Cek apakah cookie login ada
};

const ProtectedRoute = () => {
    console.log(Cookies.get('token'));
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
