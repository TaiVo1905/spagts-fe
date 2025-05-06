import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from "../../components/PasswordInput.tsx";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/update-success');
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-10">
            <h2 className="text-4xl font-bold text-blue-900 mb-3 text-center">New Password</h2>
            <p className="text-base text-gray-600 mb-8 text-center">
                Set the new password for your account to access all features.
            </p>

            <PasswordInput
                label="Enter new password"
                value={password}
                onChange={setPassword}
                placeholder="********"
                icon={<FaLock className="text-gray-400 text-lg" />}
            />
            <PasswordInput
                label="Confirm password"
                value={confirm}
                onChange={setConfirm}
                placeholder="********"
                icon={<FaLock className="text-gray-400 text-lg" />}
            />

            <button
                type="submit"
                className="w-full bg-sky-400 text-white py-4 rounded-md hover:bg-sky-500 transition-all duration-200 mt-6 text-base font-medium cursor-pointer"
            >
                UPDATE PASSWORD
            </button>
            <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-gray-300 text-gray-700 py-4 rounded-md hover:bg-gray-400 transition-all duration-200 mt-3 text-base font-medium cursor-pointer"
            >
                CANCEL
            </button>
        </form>
    );
};

export default ResetPassword;