import LoginForm from "../../components/auth/LoginForm.tsx";
import React from 'react';
import AuthLayout from "../../layouts/AuthLayout.tsx";
import {  ref, remove } from 'firebase/database';
import { database } from "../../services/firebaseService.ts";

const LoginPage: React.FC = () => {
    // remove(ref(database ,'/'));
    return <AuthLayout Form={<LoginForm/>}/>;
};

export default LoginPage;