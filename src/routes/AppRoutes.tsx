import RootLayout from "../layouts/RootLayout";
import { adminRoutes } from "./AdminRoutes";
import { studentRoutes } from "./StudentRoutes";
import  authRoutes  from "./AuthRoutes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import { teacherRoutes } from "./TeacherRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Auth routes (login, register, etc.)
      ...authRoutes,
      
      // Protected routes
      {
        path: "admin/*",
        element: <ProtectedRoute role="Admin">
          <AdminLayout />
        </ProtectedRoute>,
        children: adminRoutes
      },
      {
        path: "student/*",
        element: <ProtectedRoute role="Student">
          <StudentLayout />
        </ProtectedRoute>,
        children: studentRoutes
      },
      {
        path: "teacher/*",
        element: <ProtectedRoute role="Teacher">
          <StudentLayout />
        </ProtectedRoute>,
        children: teacherRoutes
      },
      // {
      //   path: "teacher/*",
      //   element: <ProtectedRoute role="Teacher">
      //     <TeacherLayout />
      //   </ProtectedRoute>,
      //   children: teacherRoutes
      // }

    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;