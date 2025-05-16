import React, { useState } from 'react';
import AddUserForm from './Form/AddUserForm';
import ImportUserForm from './Form/ImportUserForm';
import { AddUserPayload } from '../services/userService';

interface UserModalProps {
  open: boolean;
  editUser?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStateEdit?: AddUserPayload;
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

const UserModal: React.FC<UserModalProps> = ({ open, editUser = false, onClose, onSuccess, initialStateEdit }) => {
  const [tab, setTab] = useState<'add' | 'import'>('add');
  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--text-color)/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        {(
          <div className="flex border-b mb-4">
            {tabList.map((t) => (
              <button
                key={t.key}
                className={`flex-1 py-2 text-center font-medium transition-colors ${tab === t.key ? 'text-white bg-sky-500 rounded-t-lg' : 'text-gray-700 bg-gray-100'}`}
                onClick={() => setTab(t.key as 'add' | 'import')}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>

        {(
          <div className="mt-2">
            {editUser ? (
              <>
                <h2 className="text-lg font-bold mb-4">Edit User</h2>
                <AddUserForm onSuccess={onSuccess} initialState={initialStateEdit || initialStateAdd} />
              </>
            ) : tab === 'add' ? (
              <>
                <h2 className="text-lg font-bold mb-4">Add New User</h2>
                <AddUserForm onSuccess={onSuccess} initialState={initialStateAdd} />
              </>
            ) : (
              <ImportUserForm onSuccess={onSuccess} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserModal; 