import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAuth({ children }) {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // Si no está autenticado, redirige a /login guardando la ruta de origen
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
