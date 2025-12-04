import apiClient from './api';
import type { GlobalSearchResult } from '@/types';

export const searchService = {
  async globalSearch(query: string): Promise<GlobalSearchResult[]> {
    const response = await apiClient.get<GlobalSearchResult[]>('/search', {
      params: { q: query },
    });
    return response.data;
  },
};

