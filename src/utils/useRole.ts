import { useAuth } from '../store/AuthContext';

export type UserRole = 'Admin' | 'Teacher' | 'Student';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.roles as UserRole | undefined;
  
  return { 
    role,
    isAdmin: role === 'Admin',
    isTeacher: role === 'Teacher',
    isStudent: role === 'Student'
  };
};