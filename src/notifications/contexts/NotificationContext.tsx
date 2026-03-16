"use client"

import React, { createContext, useState, useCallback } from 'react';
import { Notification, NotificationType } from '../entity/Notification';

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, newNotification]);

      if (duration !== Infinity) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const success = useCallback(
    (message: string, duration?: number) => showNotification('success', message, duration),
    [showNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) => showNotification('error', message, duration),
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, removeNotification, success, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
