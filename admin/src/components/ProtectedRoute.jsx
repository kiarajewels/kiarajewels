import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const ProtectedRoute = () => {
  const location = useLocation();

  if (!isTokenValid()) {
    return <Navigate to="/login" replace state={{ from: location.pathname, expired: true }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
