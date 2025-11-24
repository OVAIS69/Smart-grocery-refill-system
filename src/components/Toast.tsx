import { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const typeIcons = {
  success: CheckCircleIcon,
  error: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

export const Toast = ({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const Icon = typeIcons[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md',
        typeStyles[type]
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>;
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

