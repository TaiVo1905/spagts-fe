import { Outlet } from "react-router-dom";
import { AuthProvider } from "../store/AuthContext";


const RootLayout = () => {
  return (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
  );
};

export default RootLayout;