import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputCode from '../InputCode.tsx';

const VerifyCode = () => {
    const [code, setCode] = useState(['', '', '', '']);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleCodeChange = (newCode: string[]) => {
        setCode(newCode);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/reset-password');
    };

    const handleCancel = () => {
        navigate('/login'); 
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-blue-900">Verification</h2>
            <p className="text-gray-500">Enter your 4 digits code that you received on your email.</p>

            <InputCode value={code} onChange={handleCodeChange} />

            <div className="text-center text-red-500">00:30</div>

            <button type="submit" className="w-full bg-sky-400 text-white py-3 rounded-md hover:bg-sky-500 transition">
                CONTINUE
            </button>
            <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-400 transition"
            >
                CANCEL
            </button>

            <p className="text-center text-sm text-gray-500">
                If you didn’t receive a code! <span className="text-red-500 cursor-pointer">Resend</span>
            </p>
        </form>
    );
};

export default VerifyCode;