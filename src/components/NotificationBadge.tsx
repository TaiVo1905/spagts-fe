import React from 'react';
import { NotificationBadgeProps } from '../interface/Interface';
import { FaRegBell } from 'react-icons/fa';

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => {
//   if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-200"
    >
        <FaRegBell className="w-[30px] h-[30px] text-(--text-color)/50 "/>
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  );
};

export default NotificationBadge;