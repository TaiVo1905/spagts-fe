import React, { useState } from 'react';
import UserTable from '../../components/UserTable.tsx';
import Button from "../../components/Button.tsx";
import UserModal from '../../components/UserModal.tsx';

const UserManagementPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  
  

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setReload(r => !r);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-end mb-3">
        <div>
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-3 py-1"
          />
        </div>
        <Button
          text="Add"
          onClick={handleAddClick}
          className='ml-4'
        />
      </div>
      <UserTable reload={reload} />
      <UserModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} />
      
    </div>
  );
};

export default UserManagementPage;
