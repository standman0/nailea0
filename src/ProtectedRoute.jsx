// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-6 text-gray-600 font-light">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but trying to access admin route without admin role
  if (adminOnly && !user.isAdmin) {
    // Redirect regular users to their dashboard
    return <Navigate to="/my-appointments" replace />;
  }

  // All good → render the page
  return children;
}