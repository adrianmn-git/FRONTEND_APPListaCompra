"use client"

import React from 'react';
import { useNotification } from '../hooks/useNotification';
import Toast from './Toast';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-end justify-end gap-3 px-6 py-6 pb-24 sm:pb-6"
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
