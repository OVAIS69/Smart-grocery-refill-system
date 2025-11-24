import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date: string | Date, formatStr = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

