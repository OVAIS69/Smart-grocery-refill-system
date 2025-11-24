import apiClient from './api';
import type { Notification } from '@/types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.post(`/notifications/${id}/mark-read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/mark-read');
  },
};

