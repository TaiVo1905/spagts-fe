import { useAuth } from '../store/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.roles === 'Admin';
  const isTeacher = user?.roles === 'Teacher';
  const isStudent = user?.roles === 'Student';
  
  return { isAdmin, isTeacher, isStudent, roles: user?.roles };
};