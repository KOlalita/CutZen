import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('jwt_token');
  const role = localStorage.getItem('user_role')?.toLowerCase();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to correct dashboard based on role
    if (role === 'client') return <Navigate to="/dashboard" replace />;
    if (role === 'barber') return <Navigate to="/barber" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}