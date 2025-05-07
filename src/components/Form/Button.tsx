import React from 'react';

interface Props {
    text: string;
}

const Button = ({ text }: Props) => (
    <button
        type="submit"
        className="w-full bg-sky-500 text-white py-2 rounded hover:bg-[var(--primary-color)] transition cursor-pointer"
    >
        {text}
    </button>
);

export default Button;