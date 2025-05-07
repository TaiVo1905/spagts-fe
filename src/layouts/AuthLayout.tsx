import loginImage from '../assets/login-illustration.png';
import React from 'react';
interface Props {
    Form: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({Form}) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="rounded-lg flex w-full max-w-6xl overflow-hidden">
                <div className="w-full md:w-1/2 p-6 md:p-10">
                    {Form}
                </div>
                <div className="hidden md:flex w-1/2 items-center justify-center">
                    <img
                        src={loginImage}
                        alt="Graduation Illustration"
                        className="max-w-[90%] h-auto object-contain p-4"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;