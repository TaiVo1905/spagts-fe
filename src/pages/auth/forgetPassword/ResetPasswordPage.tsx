import React from 'react';
import AuthLayout from "../../../layouts/AuthLayout.tsx";
import ResetPassword from "../../../components/auth/ResetPassword.tsx";

const ResetPasswordPage: React.FC = () => {
    return <AuthLayout Form={<ResetPassword/>}/>;
};

export default ResetPasswordPage;