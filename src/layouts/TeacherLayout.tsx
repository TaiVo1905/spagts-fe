import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import menuItems from '../utils/menuItemsForTeacherRole';

const TeacherLayout: React.FC = () => {
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
                <Sidebar menuItems={menuItems} />

                <div className="flex flex-col flex-grow ml-3">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default TeacherLayout;
