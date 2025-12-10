import apiClient from './api';
import type { UserSettings } from '@/types';

export const settingsService = {
  async getSettings(userId: number): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>(`/settings/${userId}`);
    return response.data;
  },

  async updateSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await apiClient.put<UserSettings>(`/settings/${userId}`, settings);
    return response.data;
  },

  // Get settings from localStorage as fallback
  getLocalSettings(): Partial<UserSettings> | null {
    const raw = localStorage.getItem('sg_settings');
    return raw ? JSON.parse(raw) : null;
  },

  // Save settings to localStorage
  saveLocalSettings(settings: Partial<UserSettings>): void {
    localStorage.setItem('sg_settings', JSON.stringify(settings));
  },

  // Get search history from localStorage
  getSearchHistory(): string[] {
    const raw = localStorage.getItem('sg_search_history');
    return raw ? JSON.parse(raw) : [];
  },

  // Save search to history
  addToSearchHistory(query: string): void {
    if (!query.trim()) return;
    const history = this.getSearchHistory();
    // Remove duplicates and add to front
    const filtered = history.filter((h) => h.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 10); // Keep last 10
    localStorage.setItem('sg_search_history', JSON.stringify(updated));
  },

  // Clear search history
  clearSearchHistory(): void {
    localStorage.removeItem('sg_search_history');
  },
};





