import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('authToken'); // Check for authentication token

  return token ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;