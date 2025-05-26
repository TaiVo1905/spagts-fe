import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../services/userService';
import InputCode from '../InputCode.tsx';

const VerifyCode = () => {
    const [code, setCode] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); 
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleCodeChange = (newCode: string[]) => {
        setCode(newCode);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            await userService.verifyCode(email, verificationCode);
            navigate('/reset-password', { state: { email, code: verificationCode } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired code');
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    const handleResend = async () => {
        try {
            await userService.sendResetCode(email);
            alert('Code resent successfully');
            setTimeLeft(180); 
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-blue-900">Verification</h2>
            <p className="text-gray-500">Enter the 4-digit code sent to your email.</p>

            {error && <p className="text-red-500">{error}</p>}

            <InputCode value={code} onChange={handleCodeChange} />

            <div className="text-center text-red-500 font-semibold text-lg">
                {formatTime(timeLeft)}
            </div>

            <button
                type="submit"
                className="w-full bg-sky-400 text-white py-3 rounded-md hover:bg-sky-500 transition"
            >
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
                If you didn’t receive a code!{' '}
                {timeLeft > 0 ? (
                    <span className="text-gray-400 cursor-not-allowed">Resend</span>
                ) : (
                    <span className="text-red-500 cursor-pointer" onClick={handleResend}>
                        Resend
                    </span>
                )}
            </p>
        </form>
    );
};

export default VerifyCode;
