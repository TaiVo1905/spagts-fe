import React, { useState } from 'react';
import AddUserForm from './Form/AddUserForm';
import ImportUserForm from './Form/ImportUserForm';
import { AddUserPayload } from '../services/userService';
import { useLocation } from 'react-router-dom';
import AddClassForm from './Form/AddClassForm';
import { Class, User } from '../interface/Interface';
import Modal from './Modal';

interface UserModalProps {
  open: boolean;
  editUser?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStateEdit?: AddUserPayload;
  editClass?: Class | null;
  isEditClass?: boolean;
  selectedUser?: User | null;
  isUserManagement?: boolean;
}

const tabList = [
  { key: 'add', label: 'Manually Add' },
  { key: 'import', label: 'Import from file' },
];

const initialStateAdd: AddUserPayload = {
  name: '',
  email: '',
  roles: 'Student',
  password: '',
  password_confirmation: '',
};

const initialClassState: Class = {
  id: 0,
  name: '',
  teacher: {
    id: 0,
    name: '',
    email: '',
    imageUrl: '',
    roles: 'Teacher',
    created_at: ''
  },
  students: []
};

const UserModal: React.FC<UserModalProps> = ({ 
  open, 
  editUser = false, 
  onClose, 
  onSuccess,
  initialStateEdit,
  editClass,
  isEditClass,
  selectedUser,
  isUserManagement = false
}) => {
  const [tab, setTab] = useState<'add' | 'import'>('add');
  const location = useLocation();

  if (!open) return null;

  const getModalTitle = () => {
    if (isEditClass) return "Edit Class";
    if (editUser) return "Edit User";
    if (isUserManagement) return "Add New User";
    return "Add New Class";
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={getModalTitle()}
    >
      {isUserManagement && !editUser && (
        <div className="flex border-b mb-4">
          {tabList.map((t) => (
            <button
              key={t.key}
              className={`flex-1 py-2 text-center font-medium transition-colors ${tab === t.key ? 'text-white bg-sky-500 rounded-t-lg' : 'text-gray-700 bg-gray-100'} `}
              onClick={() => setTab(t.key as 'add' | 'import')}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      
      {isUserManagement ? (
        <div className="mt-2">
          {editUser ? (
            <>
              <AddUserForm 
                onSuccess={onSuccess} 
                initialState={initialStateEdit || initialStateAdd}
                selectedUser={selectedUser}
              />
            </>
          ) : tab === 'add' ? (
            <>
              <AddUserForm 
                onSuccess={onSuccess} 
                initialState={initialStateAdd}
              />
            </>
          ) : (
            <ImportUserForm onSuccess={onSuccess} />
          )}
        </div>
      ) : (
        <AddClassForm 
          onSuccess={onSuccess} 
          isEdit={isEditClass}
          initialState={editClass || initialClassState}
        />
      )}
    </Modal>
  );
};

export default UserModal; 