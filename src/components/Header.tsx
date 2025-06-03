import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import NotificationBell from "./NotificationBell";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useRole } from "../utils/useRole";

interface Props {
    Avatar?: React.ReactNode
}

const Header: React.FC<Props> = ({Avatar}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isStudent, isTeacher } = useRole();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login')
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="h-[88px] poppins-bold flex p-[16px] shadow-md items-center">
            <span className="text-[28px]">Student Progress and Goal Tracking System</span>
            <div className="absolute z-50 right-[16px] flex" ref={dropdownRef}>
                <div className="rounded-full object-cover bg-(--text-color)/5 w-[51px] h-[47.57px] flex items-center justify-center mr-[16px] transform transition duration-300 hover:scale-105 hover:shadow-lg">
                    <NotificationBell/>
                </div>
                <div onClick={toggleDropdown} className="cursor-pointer">
                    {Avatar}
                </div>
                {isDropdownOpen && (
                    <div className="absolute top-[60px] right-0 w-[200px] bg-white rounded-md shadow-lg py-1 z-50">
                        {!isStudent && <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center" onClick={ isTeacher ? () => navigate('/teacher/profile') : () => navigate('/admin/profile')}>
                            <FaUserCircle className="mr-2" /> Edit Profile
                        </div>}
                        <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center" onClick={handleLogout}>
                            <FaSignOutAlt className="mr-2" /> Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;