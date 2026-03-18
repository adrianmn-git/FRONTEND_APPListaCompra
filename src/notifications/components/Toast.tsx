"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faExclamationTriangle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { NotificationType } from '../entity/Notification';

interface ToastProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

const TOAST_THEMES = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-800',
    icon: faCheckCircle,
    iconColor: 'text-emerald-500',
    progress: 'bg-emerald-500'
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-800',
    icon: faExclamationCircle,
    iconColor: 'text-rose-500',
    progress: 'bg-rose-500'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-800',
    icon: faExclamationTriangle,
    iconColor: 'text-amber-500',
    progress: 'bg-amber-500'
  },
  info: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    text: 'text-indigo-800',
    icon: faInfoCircle,
    iconColor: 'text-indigo-500',
    progress: 'bg-indigo-500'
  }
};

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const theme = TOAST_THEMES[type];

  return (
    <div className={`
      pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} 
      shadow-2xl shadow-slate-200/50 transition-all duration-300 animate-in fade-in slide-in-from-right-8
    `}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 mt-0.5 ${theme.iconColor}`}>
            <FontAwesomeIcon icon={theme.icon} className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-black ${theme.text} leading-tight`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notification"
            className={`flex-shrink-0 ml-4 h-6 w-6 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer text-slate-400`}
          >
            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="h-1 w-full bg-black/5">
        <div 
          className={`h-full ${theme.progress} animate-toast-progress`}
          style={{ animationDuration: '5000ms' }}
        />
      </div>
    </div>
  );
};

export default Toast;
