import { useEffect, useState } from 'react';
import { ref, onValue, off, update, remove } from 'firebase/database';
import { database } from '../services/firebaseService';
import { Notification } from '../interface/Interface';
import toast from 'react-hot-toast';

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const notificationsRef = ref(database, `notifications/${userId}`);
    
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notificationsData = snapshot.val();
      if (!notificationsData) {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      const notificationsArray = Object.entries(notificationsData)
        .map(([id, notification]: [string, any]) => ({
          id,
          ...notification
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(notificationsArray);
      setUnreadCount(notificationsArray.filter(n => !n.read).length);
      setIsLoading(false);

      // // Show toast for unread deadline notifications
      // notificationsArray
      //   .filter(n => !n.read && n.type === 'deadline')
      //   .forEach(notification => {
      //     toast(notification.message, {
      //       duration: 5000,
      //       position: 'top-right',
      //       icon: '⚠️'
      //     });
      //   });
    });

    return () => {
      off(notificationsRef);
      unsubscribe();
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = ref(database, `notifications/${userId}/${notificationId}`);
      await update(notificationRef, { read: true });
    } catch (error) {
      toast.error('Failed to mark notification as read');
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updates: Record<string, any> = {};
      notifications.forEach(notification => {
        if (!notification.read) {
          updates[`notifications/${userId}/${notification.id}/read`] = true;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
      }
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      console.error(error);
    }
  };

  const clearAll = async () => {
    try {
      const notificationsRef = ref(database, `notifications/${userId}`);
      await remove(notificationsRef);
    } catch (error) {
      toast.error('Failed to clear notifications');
      console.error(error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};