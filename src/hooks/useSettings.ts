import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/contexts/useToast';
import type { UserSettings } from '@/types';
import { getErrorMessage } from '@/utils';

export const useSettings = () => {
  const { user } = useAuthStore();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not found');
      return settingsService.getSettings(user.id);
    },
    enabled: !!user?.id,
    initialData: () => {
      // Try to get from localStorage as fallback
      const local = settingsService.getLocalSettings();
      if (local && user?.id) {
        return {
          userId: user.id,
          emailNotifications: true,
          smsNotifications: false,
          lowStockAlerts: true,
          orderUpdates: true,
          paymentReminders: true,
          autoRefillEnabled: false,
          autoRefillInterval: 30,
          autoRefillQuantityMultiplier: 2,
          theme: 'light',
          language: 'en',
          dateFormat: 'MM/dd/yyyy',
          timeFormat: '12h',
          itemsPerPage: 10,
          searchHistory: [],
          ...local,
        } as UserSettings;
      }
      return undefined;
    },
  });

  const updateSettings = useMutation({
    mutationFn: (settings: Partial<UserSettings>) => {
      if (!user?.id) throw new Error('User not found');
      return settingsService.updateSettings(user.id, settings);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings', user?.id], data);
      // Also save to localStorage
      settingsService.saveLocalSettings(data);
      success('Settings updated successfully');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to update settings'));
    },
  });

  return {
    settings: data,
    isLoading,
    updateSettings: updateSettings.mutateAsync,
    isUpdating: updateSettings.isPending,
  };
};

