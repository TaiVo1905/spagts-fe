import { RouteObject } from 'react-router-dom';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ClassManagementPage from '../pages/admin/ClassManagementPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';

export const adminRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <StudentProfilePage />
  },
  {
    path: 'user-management',
    element: <UserManagementPage />
  },
  {
    path: 'class-management',
    element: <ClassManagementPage />
  }
];