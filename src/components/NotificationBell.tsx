import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBadge from './NotificationBadge';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications(user?.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: any) => {
    
    const { commentableType, commentableId, fieldName, row, commentId, replyId } = notification.data;
    
    
    setIsOpen(false);
    
    // You'll need to implement this navigation based on your app structure
    toast.success('Navigating to the comment...');
    console.log('Navigate to:', { commentableType, commentableId, fieldName, row, commentId, replyId });
    
    // Example navigation (adjust based on your routes):
    // navigate(`/some-path/${commentableType}/${commentableId}?field=${fieldName}&row=${row}&comment=${commentId}`);
  };

  const handleMarkAsRead = (id: string) => {
    if (id === 'all') {
      markAllAsRead();
    } else {
      markAsRead(id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBadge 
        count={unreadCount} 
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onClearAll={clearAll}
          onNotificationClick={handleNotificationClick}
        />
      )}
    </div>
  );
};

export default NotificationBell;