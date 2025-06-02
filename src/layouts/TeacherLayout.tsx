import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import menuItemsForTeacherRole from '../utils/menuItemsForTeacherRole';
import menuItemsForStudentRole from '../utils/menuItemsForStudentRole';
import { useDeadlineNotifications } from '../hooks/useDeadlineNotifications';
import { usePlanSync } from '../hooks/usePlanSync';
import { useAuth } from '../store/AuthContext';

const TeacherLayout: React.FC = () => {
    const location = useLocation();
    useDeadlineNotifications();
    usePlanSync();
    
    // Get menu items using hooks
    const teacherMenuItems = menuItemsForTeacherRole();
    const studentMenuItems = menuItemsForStudentRole();
    
    // Determine which menu items to use
    const menuItems = location.pathname.toLowerCase().includes('teacher/modules') 
        ? teacherMenuItems 
        : studentMenuItems;
    const { user } = useAuth();

    return (
        <>
            <Header
                Avatar={
                    <Avatar
                        name={user?.name}
                        imageUrl= {user?.imageUrl}
                        className="w-[48px] h-[48px]"
                    />
                }
            />

            <div className="flex">
                {!location.pathname.toLowerCase().includes('teacher/profile') && <Sidebar menuItems={menuItems} />}

                <div className="flex flex-col flex-grow w-[calc(100vw-300px)]">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default TeacherLayout;
