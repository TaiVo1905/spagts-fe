import EnterEmail from "../../components/auth/EnterEmail.tsx";
import React from 'react';
import AuthLayout from "../../layouts/AuthLayout.tsx";

const EnterEmailPage: React.FC = () => {
    return <AuthLayout Form={<EnterEmail/>}/>;
};

export default EnterEmailPage;