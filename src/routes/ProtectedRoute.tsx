import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useRole } from '../utils/useRole';
import LoadingToFetchData from '../components/LoadingToFetchData';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'Admin' | 'Teacher' | 'Student';
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { role: userRole } = useRole();
  const location = useLocation();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center'>
        <LoadingToFetchData/>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};