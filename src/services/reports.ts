import apiClient from './api';
import type { MonthlyConsumptionReport } from '@/types';

export const reportService = {
  async getMonthlyConsumption(start?: string, end?: string): Promise<MonthlyConsumptionReport[]> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await apiClient.get<MonthlyConsumptionReport[]>(
      `/reports/monthly-consumption?${params}`
    );
    return response.data;
  },
};

