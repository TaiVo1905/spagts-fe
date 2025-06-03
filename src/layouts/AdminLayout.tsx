import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import menuItems from '../utils/menuItemsForAdminRole';
import { usePlanSync } from '../hooks/usePlanSync';
import { useAuth } from '../store/AuthContext';
// import { useDeadlineNotifications } from '../hooks/useDeadlineNotifications';

const AdminLayout: React.FC = () => {
    // useDeadlineNotifications();
    // usePlanSync();
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
                {!location.pathname.toLowerCase().includes('admin/profile') && <Sidebar
                    menuItems={menuItems}
                />}
                <Outlet/>
            </div>
        </>
    );
};

export default AdminLayout;