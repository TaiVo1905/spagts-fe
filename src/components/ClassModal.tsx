// ClassModal.tsx
import React, { useEffect, useState } from 'react';
import AddClassForm from './Form/AddClassForm';
import { Class } from '../interface/Interface';

interface ClassModalProps {
  open: boolean;
  isEditClass?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStateEdit?: Class | null;
}

const ClassModal: React.FC<ClassModalProps> = ({ open, isEditClass = false, onClose, onSuccess, initialStateEdit }) => {
  const [initialState, setInitialState] = useState<Class | null>(null);

  useEffect(() => {
    if (initialStateEdit) {
      setInitialState(initialStateEdit);
    } else {
      setInitialState({ id: 0, teacher_id: 0, name: '', teacher: { id: 0, name: '', email: '', roles: '' } });
    }
  }, [initialStateEdit]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <div className="flex border-b mb-4">
          <div className="text-lg font-semibold">
            {isEditClass ? 'Edit Class' : 'Create New Class'}
          </div>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mt-2">
          {initialState && (
            <AddClassForm
              isEdit={isEditClass} 
              onSuccess={() => {
                onClose();
                if (onSuccess) onSuccess();
              }}
              initialState={initialState}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassModal;