import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import menuItems from '../utils/menuItemsForStudentRole';
import { usePlanSync } from '../hooks/usePlanSync';
import { useDeadlineNotifications } from '../hooks/useDeadlineNotifications';
import { useAuth } from '../store/AuthContext';

const StudentLayout: React.FC = () => {
    useDeadlineNotifications();
    usePlanSync();
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
            <div className='flex'>
                <Sidebar
                    menuItems={Array.isArray(menuItems) ? menuItems : menuItems()}
                />
                <Outlet/>
            </div>
        </>
    );
};

export default StudentLayout;