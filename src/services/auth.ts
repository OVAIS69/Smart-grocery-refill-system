import apiClient from './api';
import type { LoginCredentials, LoginResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('sg_token', token);
    localStorage.setItem('sg_user', JSON.stringify(user));
    return { token, user };
  },

  logout(): void {
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_user');
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem('sg_user');
    return raw ? JSON.parse(raw) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('sg_token');
  },
};

