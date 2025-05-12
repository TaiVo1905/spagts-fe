import VerifyCode from "../../../components/auth/VerifyCode.tsx";
import React from 'react';
import AuthLayout from "../../../layouts/AuthLayout.tsx";

const VerifyCodePage: React.FC = () => {
    return <AuthLayout Form={<VerifyCode/>}/>;
};

export default VerifyCodePage;