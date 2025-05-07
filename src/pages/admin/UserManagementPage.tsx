import React from 'react';
import UserTable from '../../components/UserTable.tsx';
import Button from "../../components/Button.tsx";



const UserManagementPage: React.FC = () => {
  const handleAddClick = () => {
  };
  
  return (
        <div className="p-4">
          <div className="flex items-center justify-end mb-3">
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
              className='ml-4'
              />
          </div>
          <UserTable />
        </div>
  );
};


export default UserManagementPage;
