import RootLayout from "../layouts/RootLayout";
import adminRoutes from "./AdminRoutes";
import studentRoutes from "./StudentRoutes";
import authRoutes from "./AuthRoutes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      adminRoutes,
      studentRoutes,
      ...authRoutes,
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
