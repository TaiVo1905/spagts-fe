import { RouteObject } from "react-router-dom";
// import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import EnterEmailPage from "../pages/forgetPassword/EnterEmailPage";
import ResetPasswordPage from "../pages/forgetPassword/ResetPasswordPage";
import VerifyCodePage from "../pages/forgetPassword/VerifyCodePage";
import LogoutPage from "../pages/LogoutPage";
import UnauthorizedPage from "../pages/UnauthorizePage";

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