import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notification.service';
import { toast } from 'sonner';

// Observer pattern for notifications without WebSockets
const observers = new Set();

const notifyObservers = (data) => {
  observers.forEach((callback) => callback(data));
};

export const useNotifications = (pollingInterval = 5000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [count, list] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getAll()
      ]);
      
      const newUnreadCount = Number(count) || 0;
      const newList = Array.isArray(list) ? list : [];

      // Check for new notifications to show toast
      if (silent && newUnreadCount > unreadCount) {
        const latest = newList[0];
        if (latest && latest.isUnread) {
          toast.info(latest.message, {
            description: 'New Notification Received',
            action: {
              label: 'View',
              onClick: () => window.location.hash = '/student/notifications'
            }
          });
        }
      }

      const data = { unreadCount: newUnreadCount, notifications: newList };
      setUnreadCount(newUnreadCount);
      setNotifications(newList);
      
      // Notify other instances of this hook
      notifyObservers(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [unreadCount]);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Setup observer
    const handleUpdate = (data) => {
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications);
    };
    observers.add(handleUpdate);

    // Setup polling
    const interval = setInterval(() => fetchNotifications(true), pollingInterval);

    return () => {
      observers.delete(handleUpdate);
      clearInterval(interval);
    };
  }, [fetchNotifications, pollingInterval]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      const updatedList = notifications.map(n => n.id === id ? { ...n, isUnread: false } : n);
      const updatedCount = Math.max(0, unreadCount - 1);
      
      const data = { unreadCount: updatedCount, notifications: updatedList };
      setUnreadCount(updatedCount);
      setNotifications(updatedList);
      notifyObservers(data);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      const updatedList = notifications.map(n => ({ ...n, isUnread: false }));
      
      const data = { unreadCount: 0, notifications: updatedList };
      setUnreadCount(0);
      setNotifications(updatedList);
      notifyObservers(data);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.deleteAll();
      const data = { unreadCount: 0, notifications: [] };
      setUnreadCount(0);
      setNotifications([]);
      notifyObservers(data);
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    refresh: fetchNotifications,
    markAsRead,
    markAllRead,
    clearAll
  };
};
