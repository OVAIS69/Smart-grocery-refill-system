import apiClient from './api';
import type { Product, ProductFilters, PaginatedResponse } from '@/types';

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.q) params.append('q', filters.q);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.lowStock) params.append('lowStock', 'true');

    const response = await apiClient.get<PaginatedResponse<Product>>(`/products?${params}`);
    return response.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiClient.post<Product>('/products', product);
    return response.data;
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};

