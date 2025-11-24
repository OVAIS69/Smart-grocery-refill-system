import apiClient from './api';
import type { Order, OrderFilters, PaginatedResponse } from '@/types';

export const orderService = {
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplierId) params.append('supplierId', filters.supplierId.toString());

    const response = await apiClient.get<PaginatedResponse<Order>>(`/orders?${params}`);
    return response.data;
  },

  async getOrder(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async createOrder(order: {
    productId: number;
    quantity: number;
  }): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', order);
    return response.data;
  },

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    const response = await apiClient.put<Order>(`/orders/${id}`, { status });
    return response.data;
  },
};

