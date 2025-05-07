import LoginForm from "../components/auth/LoginForm.tsx";
import React from 'react';
import AuthLayout from "../layouts/AuthLayout.tsx";

const LoginPage: React.FC = () => {
    return <AuthLayout Form={<LoginForm/>}/>;
};

export default LoginPage;