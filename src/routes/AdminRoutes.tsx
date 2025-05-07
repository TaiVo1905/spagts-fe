import { RouteObject } from "react-router-dom"
import ClassManagementPage from "../pages/admin/ClassManagementPage"
import UserManagementPage from "../pages/admin/UserManagementPage"
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes: RouteObject = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "user-management", element: <UserManagementPage /> },
      { path: "class-management", element: <ClassManagementPage /> },
    ],
  };

export default AdminRoutes;