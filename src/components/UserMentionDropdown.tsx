import React from 'react';

interface UserMentionDropdownProps {
  users: any[];
  onSelect: (user: any) => void;
  onClose: () => void;
}

const UserMentionDropdown: React.FC<UserMentionDropdownProps> = ({ users, onSelect, onClose }) => {
  const handleSelect = (user: any) => {
    onSelect(user);
    onClose();
  };

  return (
    <div className="absolute z-10 bottom-full mb-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
      {users.length > 0 ? (
        <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {users.map(user => (
            <li
              key={user.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSelect(user)}
            >
              <img 
                src={user.imageUrl || '/default-avatar.png'} 
                alt={user.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-3 py-2 text-gray-500">No users found</div>
      )}
    </div>
  );
};

export default UserMentionDropdown;