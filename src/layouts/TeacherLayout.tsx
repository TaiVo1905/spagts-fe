import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import menuItemsForTeacherRole from '../utils/menuItemsForTeacherRole';
import menuItemsForStudentRole from '../utils/menuItemsForStudentRole';
import { useDeadlineNotifications } from '../hooks/useDeadlineNotifications';
import { usePlanSync } from '../hooks/usePlanSync';

const TeacherLayout: React.FC = () => {
    const location = useLocation();
    useDeadlineNotifications();
    usePlanSync();
    return (
        <>
            {/* Header có Avatar giáo viên */}
            <Header
                Avatar={
                    <Avatar
                        name="Nguyễn Thị Thùy Trang"
                        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
                        className="w-[48px] h-[48px]"
                    />
                }
            />

            <div className="flex">
                <Sidebar menuItems={location.pathname.toLowerCase().includes('teacher/dashboard') ? menuItemsForTeacherRole() : menuItemsForStudentRole()} />

                <div className="flex flex-col flex-grow w-[calc(100vw-300px)]">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default TeacherLayout;
