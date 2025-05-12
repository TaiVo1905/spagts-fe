import { RouteObject } from "react-router-dom";
// import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import EnterEmailPage from "../pages/auth/forgetPassword/EnterEmailPage";
import ResetPasswordPage from "../pages/auth/forgetPassword/ResetPasswordPage";
import VerifyCodePage from "../pages/auth/forgetPassword/VerifyCodePage";
import LogoutPage from "../pages/auth/LogoutPage";
import UnauthorizedPage from "../pages/auth/UnauthorizePage";

const authRoutes: RouteObject[] = [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/logout",
      element: <LogoutPage />,
    },
    {
      path: '/unauthorized',
      element: <UnauthorizedPage />,
    },
    {
      path: "/enter-email",
      element: <EnterEmailPage />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
    },
    {
        path: "/verify-code",
        element: <VerifyCodePage />,
    },
  ];
  
  export default authRoutes;