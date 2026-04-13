"use client"

import React, { createContext, useCallback } from 'react';
import { Notification, NotificationType } from '../entity/Notification';
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const removeNotification = useCallback((id: string) => {
    toast.dismiss(id)
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration = 5000) => {
      if (type === 'success') toast.success(message, { duration });
      else if (type === 'error') toast.error(message, { duration });
      else if (type === 'warning') toast.warning(message, { duration });
      else toast.info(message, { duration });
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) => { toast.success(message, { duration }) },
    []
  );

  const error = useCallback(
    (message: string, duration?: number) => { toast.error(message, { duration }) },
    []
  );

  return (
    <NotificationContext.Provider
      value={{ notifications: [], showNotification, removeNotification, success, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
