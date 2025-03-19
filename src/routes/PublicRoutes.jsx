import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  return document.cookie.includes('token='); // Cek apakah cookie login ada
};

const PublicRoute = () => {
    return isAuthenticated ? <Navigate to="/" /> :<Navigate to="/login" />;
};

export default PublicRoute;
