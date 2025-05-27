import React from 'react';
import { Notification, NotificationDropdownProps } from '../interface/Interface';
import toast from 'react-hot-toast';

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  onNotificationClick
}) => {
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
      <div className="p-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              onClearAll();
              toast.success('All notifications cleared');
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              const unreadCount = notifications.filter(n => !n.read).length;
              if (unreadCount > 0) {
                onMarkAsRead('all');
                toast.success(`Marked ${unreadCount} notifications as read`);
              }
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark All as Read
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-2"></span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;