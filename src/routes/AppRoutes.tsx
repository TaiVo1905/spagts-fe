// src/AppRouter.tsx
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import adminRoutes from "./AdminRoutes";
import studentRoutes from "./StudentRoutes";
import authRoutes from "./AuthRoutes";

const router = createBrowserRouter([
  adminRoutes,
  ...authRoutes,
  studentRoutes
])

const AppRoutes = () => {
  return (<RouterProvider router={router} />);
};

export default AppRoutes;
