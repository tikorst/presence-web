import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ requiredRole }) => {
  const { role, loading, error } = useContext(AuthContext);
  

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="error-message">{error}</p>;

  if (!role) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== requiredRole){
    toast.error('Anda tidak memiliki akses ke halaman ini');
    if (role === 'Admin') {
      return <Navigate to="/admin" replace />;
    }
    if (role === 'Dosen') {
      return <Navigate to="/" replace />;
    }
    
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;