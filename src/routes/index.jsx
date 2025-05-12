import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Admin from '../pages/Admin';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/Unauthorized';
import PublicRoute from './PublicRoute';

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route element={<ProtectedRoute requiredRole="Dosen" />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="Admin" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;