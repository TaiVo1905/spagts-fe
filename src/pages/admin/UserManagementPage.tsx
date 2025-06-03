import React, { useState } from 'react';
import UserTable from '../../components/UserTable.tsx';
import Button from "../../components/Button.tsx";
import  UserModal  from '../../components/UserModal.tsx';

const UserManagementPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setReload(r => !r);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleReload = () => {
    setReload(r => !r);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-end mb-3">
        <div>
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button
          text="Add"
          onClick={handleAddClick}
          className='ml-4'
        />
      </div>
      <UserTable 
        reload={reload} 
        searchQuery={searchQuery} 
        onReload={handleReload}
      />
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        isUserManagement={true}
        editUser={false}
      />
    </div>
  );
};

export default UserManagementPage;
