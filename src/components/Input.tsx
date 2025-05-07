import React from 'react';

interface Props {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    icon?: React.ReactNode; 
}

const Input = ({ label, type, value, onChange, placeholder, icon }: Props) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {icon && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                </span>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200`}
            />
        </div>
    </div>
);

export default Input;