import React from 'react';
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar";
import menuItems from "../utils/menuItemsForAdminRole.tsx";
import UserTable from '../components/UserTable';
import Avatar from "../components/Avatar";
import Button from "../components/Button.tsx";



const UserManagementPage: React.FC = () => {
  const handleAddClick = () => {
  };
  
  return (
    <MainLayout
      Header={
        <Header
          Avatar={
            <Avatar
              name="Nguyễn Thị Thùy Trang"
              imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
              className="w-[48px] h-[48px]"
            />
          }
        />
      }
      Sidebar={<Sidebar menuItems={menuItems} />}
      Content={
        <div className="p-4">
          <div className="flex justify-between items-center mb-3 pl-170 pr-7">
            <div>
              <input
                type="text"
                placeholder="Search"
                className="border rounded px-3 py-1 pr-"
              />
            </div>
            <Button
              text="Add"
              onClick={handleAddClick} 
              />
          </div>
          <UserTable />
        </div>
      }
    />
  );
};


export default UserManagementPage;
