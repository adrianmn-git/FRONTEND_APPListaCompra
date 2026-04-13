"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { useI18n } from '@/i18n/hooks/useI18n';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmAlertDialog: React.FC<ConfirmAlertDialogProps> = ({
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

  const themes = {
    danger: {
      icon: faTrashAlt,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      buttonVariant: 'destructive' as const,
    },
    warning: {
      icon: faExclamationTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      buttonVariant: 'default' as const,
    },
    info: {
      icon: faExclamationTriangle,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      buttonVariant: 'default' as const,
    }
  };

  const theme = themes[type];

  // We are mapping the custom UI to shadcn's AlertDialog.
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-md rounded-[2rem] p-6 border-slate-100 shadow-2xl">
        <AlertDialogHeader className="flex flex-col items-center text-center sm:text-center space-y-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor}`}>
            <FontAwesomeIcon icon={theme.icon} size="2x" />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-slate-800 tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 leading-relaxed max-w-[90%] mx-auto">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 flex flex-row items-center gap-3 p-6 bg-slate-50 border-t border-slate-100 rounded-b-[2rem] mt-6">
          <AlertDialogCancel 
            onClick={onClose}
            className="flex-1 h-12 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all cursor-pointer m-0"
          >
            {finalCancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onClose();
            }}
            className="flex-[1.5] h-12 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer m-0"
            variant={theme.buttonVariant}
          >
            {finalConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlertDialog;
