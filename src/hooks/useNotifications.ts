import { useState, useEffect, useCallback } from 'react';
import type { Notification } from '../types';
import { mockNotifications } from '../utils/mockData';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    setPermission(Notification.permission);
    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', reg.scope);
      setSwRegistered(true);
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  };

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      showNativeNotification('MediFlow Notifications Enabled', {
        body: 'You will now receive real-time healthcare alerts.',
        tag: 'welcome',
      });
    }
  }, []);

  const showNativeNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return;
    if ('serviceWorker' in navigator && swRegistered) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }, [permission, swRegistered]);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `N${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showNativeNotification(notif.title, { body: notif.body, tag: newNotif.id });
  }, [showNativeNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    permission,
    swRegistered,
    requestPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
  };
};
