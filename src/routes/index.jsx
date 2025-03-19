import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Login from '../pages/login';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoutes';
import PublicRoute from './PublicRoutes';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
      
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
