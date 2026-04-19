import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Optionally return a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="w-10 h-10 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access a route they don't have permission for
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
