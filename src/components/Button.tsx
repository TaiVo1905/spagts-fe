import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '', 
}) => {
  return (
    <button
      onClick={onClick}
className={`flex items-center justify-center px-4 py-2 rounded-[10px] transition-colors duration-300 w-[95px] h-[40px] text-[16px] border border-[#21BAEA] bg-[#21BAEA] hover:bg-[#0a8dba] ${className}`}
    >
      {text === '' ? (
        <span className="text-[1.2rem]">+</span>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;