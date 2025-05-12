import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { role, loading, error } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!role) return <Navigate to="/login" replace />;
  if (role !== requiredRole) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;