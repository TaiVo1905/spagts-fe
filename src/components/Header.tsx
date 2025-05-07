import React from "react";
import { FaRegBell } from "react-icons/fa";

interface Props {
    Avatar?: React.ReactNode
}

const Header: React.FC<Props> = ({Avatar}) => {
    return (
        <div className="h-[88px] poppins-bold flex p-[16px] shadow-md items-center">
            <span className="text-[28px]">Student Progress and Goal Tracking System</span>
            <div className="absolute right-[16px] flex">
                <div className="rounded-full object-cover bg-(--text-color)/5 w-[51px] h-[47.57px] flex items-center justify-center mr-[16px] transform transition duration-300 hover:scale-105 hover:shadow-lg">
                    <FaRegBell className="w-[30px] h-[30px] text-(--text-color)/50 "/>
                </div>
                {Avatar}
            </div>
        </div>
    );
}

export default Header;