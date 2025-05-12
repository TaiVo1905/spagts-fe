import { RouteObject } from 'react-router-dom';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ClassManagementPage from '../pages/admin/ClassManagementPage';

export const adminRoutes: RouteObject[] = [
  {
    path: 'user-management',
    element: <UserManagementPage />
  },
  {
    path: 'class-management',
    element: <ClassManagementPage />
  }
];