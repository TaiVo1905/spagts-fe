import { RouteObject } from "react-router-dom";
import ClassManagementPage from "../pages/admin/ClassManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute roles={['Admin']}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "user-management", element: <UserManagementPage /> },
    { path: "class-management", element: <ClassManagementPage /> },
  ],
};

export default adminRoutes;