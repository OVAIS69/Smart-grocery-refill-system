import { createContext } from 'react';
import type { ToastType } from '@/components/Toast';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

export interface ToastContextShape {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextShape | undefined>(undefined);


