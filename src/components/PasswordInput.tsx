import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface Props {
    label: string;
    value: string;
    placeholder?: string; 
    onChange: (value: string) => void;
    icon?: React.ReactNode;
}

const PasswordInput = ({ label, value, onChange, icon, placeholder }: Props) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <label className="block text-base font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {icon}
                    </span>
                )}
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder} 
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base`}
                />
                <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
        </div>
    );
};

export default PasswordInput;