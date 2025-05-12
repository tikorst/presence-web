import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = () => {
  const { role, loading, error } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (role === 'Dosen') return <Navigate to="/" replace />;
  if (role === 'Admin') return <Navigate to="/admin" replace />;

  return <Outlet />;
};
export default PublicRoute;