import { useContext } from 'react';
import { ToastContext, ToastContextShape } from './ToastContext.base';

export const useToast = (): ToastContextShape => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

