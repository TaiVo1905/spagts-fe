import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';

const EnterEmail = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (typeof email !== 'string') {
                throw new Error('Email must be a string');
            }
            await userService.sendResetCode(email);
            navigate('/verify-code', { state: { email } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset code');
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-blue-900">Forgot Password</h2>
            <p className="text-gray-500">Enter your email for the verification process, we will send a 4-digit code to your email.</p>

            {error && <p className="text-red-500">{error}</p>}

            <div>
                <label className="block text-sm text-blue-900 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>

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
        </form>
    );
};

export default EnterEmail;