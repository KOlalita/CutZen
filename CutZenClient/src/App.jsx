import React from 'react';
import AuthPage from './pages/AuthPage';
import ClientDashboard from './ClientDashboard';
import BarberDashboard from './pages/BarberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';  // <-- added Navigate


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected - Client */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected - Barber */}
        <Route
          path="/barber"
          element={
            <ProtectedRoute allowedRoles={['barber']}>
              <BarberDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}