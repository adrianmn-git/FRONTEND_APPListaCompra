"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useI18n } from '@/i18n/hooks/useI18n';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'danger'
}) => {
  const { t } = useI18n();
  const finalConfirmText = confirmText || t("common.confirm", { defaultValue: 'Confirm' });
  const finalCancelText = cancelText || t("common.cancel", { defaultValue: 'Cancel' });

  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: faTrashAlt,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      buttonBg: 'bg-rose-600 hover:bg-rose-700',
    },
    warning: {
      icon: faExclamationTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: faExclamationTriangle,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    }
  };

  const theme = themes[type];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor}`}>
            <FontAwesomeIcon icon={theme.icon} size="2x" />
          </div>

          <h3 className="mb-2 text-2xl font-black text-slate-800 tracking-tight">
            {title}
          </h3>
          
          <p className="mb-8 text-slate-500 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row w-full gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer"
            >
              {finalCancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-[2] py-4 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all cursor-pointer ${theme.buttonBg}`}
            >
              {finalConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
