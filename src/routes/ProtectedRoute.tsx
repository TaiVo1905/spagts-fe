import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useRole } from '../utils/useRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('Admin' | 'Teacher' | 'Student')[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const { isAdmin, isTeacher, isStudent } = useRole();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles) {
    const hasRequiredRole = roles.some(role => {
      switch (role) {
        case 'Admin':
          return isAdmin;
        case 'Teacher':
          return isTeacher;
        case 'Student':
          return isStudent;
        default:
          return false;
      }
    });

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};