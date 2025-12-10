import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Input, Select } from '@/components/FormFields';
import { Loading } from '@/components/Loading';
import { useToast } from '@/contexts/useToast';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/services/api';
import { getErrorMessage } from '@/utils';
import {
  UserCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const credentialsSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // If new password is provided, confirm password must match
  if (data.newPassword && data.newPassword.length > 0) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

export const Settings = () => {
  const { user, hasRole } = useAuthStore();
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<'preferences' | 'credentials'>('preferences');
  const isAdmin = hasRole(['admin']);

  const {
    register: registerCredentials,
    handleSubmit: handleCredentialsSubmit,
    formState: { errors: credentialsErrors, isSubmitting: isUpdatingCredentials },
    reset: resetCredentials,
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
  });

  if (isLoading || !settings) {
    return <Loading />;
  }

  const handlePreferencesSave = async (data: Partial<typeof settings>) => {
    await updateSettings(data);
  };

  const handleCredentialsUpdate = async (data: CredentialsFormData) => {
    if (!user?.id) {
      showError('User not found');
      return;
    }

    try {
      // Verify current password by attempting login
      try {
        const loginResponse = await apiClient.post('/auth/login', {
          email: user.email,
          password: data.currentPassword,
        });

        if (!loginResponse.data || !loginResponse.data.token) {
          showError('Current password is incorrect');
          return;
        }
      } catch (loginError: any) {
        if (loginError.response?.status === 401) {
          showError('Current password is incorrect');
          return;
        }
        throw loginError;
      }

      // Update user credentials
      const updateData: { email?: string; password?: string } = {};
      if (data.newEmail && data.newEmail.trim() !== '') {
        updateData.email = data.newEmail;
      }
      if (data.newPassword && data.newPassword.trim() !== '') {
        updateData.password = data.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        showError('Please provide at least one field to update');
        return;
      }

      await apiClient.put(`/users/${user.id}`, updateData);
      success('Credentials updated successfully. Please login again.');
      resetCredentials();
      
      // Update local user data if email changed
      if (updateData.email) {
        const updatedUser = { ...user, email: updateData.email };
        localStorage.setItem('sg_user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      showError(getErrorMessage(error, 'Failed to update credentials'));
    }
  };

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: UserCircleIcon },
    ...(isAdmin ? [{ id: 'credentials', label: 'Credentials', icon: KeyIcon }] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'preferences' | 'credentials')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* User Preferences */}
            {activeTab === 'preferences' && (
              <PreferencesSection settings={settings} onSave={handlePreferencesSave} isUpdating={isUpdating} />
            )}

            {/* Credentials Section (Admin Only) */}
            {activeTab === 'credentials' && isAdmin && (
              <CredentialsSection
                currentEmail={user?.email || ''}
                onSubmit={handleCredentialsSubmit(handleCredentialsUpdate)}
                register={registerCredentials}
                errors={credentialsErrors}
                isSubmitting={isUpdatingCredentials}
                onReset={resetCredentials}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PreferencesSectionProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  isUpdating: boolean;
}

const PreferencesSection = ({ settings, onSave, isUpdating }: PreferencesSectionProps) => {
  const [formData, setFormData] = useState({
    theme: settings.theme || 'light',
    language: settings.language || 'en',
    dateFormat: settings.dateFormat || 'MM/dd/yyyy',
    timeFormat: settings.timeFormat || '12h',
    itemsPerPage: settings.itemsPerPage || 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">User Preferences</h2>
        <p className="text-sm text-slate-500">Customize your application experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Theme"
          value={formData.theme}
          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (System)' },
          ]}
        />

        <Select
          label="Language"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
          ]}
        />

        <Select
          label="Date Format"
          value={formData.dateFormat}
          onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
          options={[
            { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
            { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
            { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
          ]}
        />

        <Select
          label="Time Format"
          value={formData.timeFormat}
          onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
          options={[
            { value: '12h', label: '12 Hour' },
            { value: '24h', label: '24 Hour' },
          ]}
        />

        <Input
          type="number"
          label="Items Per Page"
          value={formData.itemsPerPage.toString()}
          onChange={(e) => setFormData({ ...formData, itemsPerPage: parseInt(e.target.value) || 10 })}
          min="5"
          max="100"
        />
      </div>

      <div className="flex justify-end pt-4 border-t-2 border-primary-100">
        <button type="submit" disabled={isUpdating} className="btn btn-primary">
          {isUpdating ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
};

interface CredentialsSectionProps {
  currentEmail: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: any;
  errors: any;
  isSubmitting: boolean;
  onReset: () => void;
}

const CredentialsSection = ({
  currentEmail,
  onSubmit,
  register,
  errors,
  isSubmitting,
  onReset,
}: CredentialsSectionProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Update Credentials</h2>
        <p className="text-sm text-slate-500">Change your login email and password</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Current Email</label>
          <input
            type="email"
            value={currentEmail}
            disabled
            className="input bg-slate-100 cursor-not-allowed"
            readOnly
          />
          <p className="mt-1 text-xs text-slate-500">Your current email address</p>
        </div>

        <Input
          {...register('newEmail')}
          type="email"
          label="New Email (Optional)"
          placeholder="Enter new email address"
          error={errors.newEmail?.message}
        />

        <Input
          {...register('currentPassword')}
          type="password"
          label="Current Password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          required
        />

        <Input
          {...register('newPassword')}
          type="password"
          label="New Password (Optional)"
          placeholder="Enter new password (min 6 characters)"
          error={errors.newPassword?.message}
        />

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t-2 border-primary-100">
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Reset
        </button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Updating...' : 'Update Credentials'}
        </button>
      </div>
    </form>
  );
};
