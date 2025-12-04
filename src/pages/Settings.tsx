import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Input, Select } from '@/components/FormFields';
import { Loading } from '@/components/Loading';
import { useToast } from '@/contexts/useToast';
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const Settings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications' | 'autorefill' | 'search'>('preferences');

  if (isLoading || !settings) {
    return <Loading />;
  }

  const handleSave = async (section: string, data: Partial<typeof settings>) => {
    await updateSettings(data);
  };

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: UserCircleIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'autorefill', label: 'Auto-Refill', icon: ArrowPathIcon },
    { id: 'search', label: 'Search', icon: MagnifyingGlassIcon },
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
                    onClick={() => setActiveTab(tab.id as any)}
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
              <PreferencesSection settings={settings} onSave={handleSave} isUpdating={isUpdating} />
            )}

            {/* Notification Preferences */}
            {activeTab === 'notifications' && (
              <NotificationsSection settings={settings} onSave={handleSave} isUpdating={isUpdating} />
            )}

            {/* Auto-Refill Configuration */}
            {activeTab === 'autorefill' && (
              <AutoRefillSection settings={settings} onSave={handleSave} isUpdating={isUpdating} />
            )}

            {/* Search Settings */}
            {activeTab === 'search' && (
              <SearchSection settings={settings} onSave={handleSave} isUpdating={isUpdating} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  settings: any;
  onSave: (section: string, data: any) => Promise<void>;
  isUpdating: boolean;
}

const PreferencesSection = ({ settings, onSave, isUpdating }: SectionProps) => {
  const [formData, setFormData] = useState({
    theme: settings.theme || 'light',
    language: settings.language || 'en',
    dateFormat: settings.dateFormat || 'MM/dd/yyyy',
    timeFormat: settings.timeFormat || '12h',
    itemsPerPage: settings.itemsPerPage || 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave('preferences', formData);
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

const NotificationsSection = ({ settings, onSave, isUpdating }: SectionProps) => {
  const [formData, setFormData] = useState({
    emailNotifications: settings.emailNotifications ?? true,
    smsNotifications: settings.smsNotifications ?? false,
    lowStockAlerts: settings.lowStockAlerts ?? true,
    orderUpdates: settings.orderUpdates ?? true,
    paymentReminders: settings.paymentReminders ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave('notifications', formData);
  };

  const toggleSetting = (key: keyof typeof formData) => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Notification Preferences</h2>
        <p className="text-sm text-slate-500">Choose how you want to be notified</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary-100 bg-primary-50/50">
          <div>
            <p className="font-medium text-slate-900">Email Notifications</p>
            <p className="text-sm text-slate-500">Receive notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={() => toggleSetting('emailNotifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white">
          <div>
            <p className="font-medium text-slate-900">SMS Notifications</p>
            <p className="text-sm text-slate-500">Receive notifications via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.smsNotifications}
              onChange={() => toggleSetting('smsNotifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white">
          <div>
            <p className="font-medium text-slate-900">Low Stock Alerts</p>
            <p className="text-sm text-slate-500">Get notified when products are low in stock</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.lowStockAlerts}
              onChange={() => toggleSetting('lowStockAlerts')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white">
          <div>
            <p className="font-medium text-slate-900">Order Updates</p>
            <p className="text-sm text-slate-500">Receive notifications for order status changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.orderUpdates}
              onChange={() => toggleSetting('orderUpdates')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white">
          <div>
            <p className="font-medium text-slate-900">Payment Reminders</p>
            <p className="text-sm text-slate-500">Get reminded about unpaid orders</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.paymentReminders}
              onChange={() => toggleSetting('paymentReminders')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t-2 border-primary-100">
        <button type="submit" disabled={isUpdating} className="btn btn-primary">
          {isUpdating ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </form>
  );
};

const AutoRefillSection = ({ settings, onSave, isUpdating }: SectionProps) => {
  const [formData, setFormData] = useState({
    autoRefillEnabled: settings.autoRefillEnabled ?? false,
    autoRefillInterval: settings.autoRefillInterval ?? 30,
    autoRefillQuantityMultiplier: settings.autoRefillQuantityMultiplier ?? 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave('autorefill', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Auto-Refill Configuration</h2>
        <p className="text-sm text-slate-500">Configure automatic inventory refill settings</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary-100 bg-primary-50/50">
          <div>
            <p className="font-medium text-slate-900">Enable Auto-Refill</p>
            <p className="text-sm text-slate-500">Automatically create orders when stock is low</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoRefillEnabled}
              onChange={(e) => setFormData({ ...formData, autoRefillEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        {formData.autoRefillEnabled && (
          <>
            <div>
              <Input
                type="number"
                label="Check Interval (seconds)"
                value={formData.autoRefillInterval.toString()}
                onChange={(e) => setFormData({ ...formData, autoRefillInterval: parseInt(e.target.value) || 30 })}
                min="10"
                max="300"
              />
              <p className="mt-1 text-xs text-slate-500">How often to check for low stock (10-300 seconds)</p>
            </div>

            <div>
              <Input
                type="number"
                label="Quantity Multiplier"
                value={formData.autoRefillQuantityMultiplier.toString()}
                onChange={(e) =>
                  setFormData({ ...formData, autoRefillQuantityMultiplier: parseFloat(e.target.value) || 2 })
                }
                step="0.1"
                min="1"
                max="10"
              />
              <p className="mt-1 text-xs text-slate-500">Order quantity = threshold × multiplier</p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t-2 border-primary-100">
        <button type="submit" disabled={isUpdating} className="btn btn-primary">
          {isUpdating ? 'Saving...' : 'Save Auto-Refill Settings'}
        </button>
      </div>
    </form>
  );
};

const SearchSection = ({ settings, onSave, isUpdating }: SectionProps) => {
  const { settingsService } = require('@/services/settings');
  const searchHistory = settingsService.getSearchHistory();

  const handleClearHistory = () => {
    settingsService.clearSearchHistory();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Search Settings</h2>
        <p className="text-sm text-slate-500">Manage your search history and preferences</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border-2 border-primary-100 bg-primary-50/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-slate-900">Search History</p>
              <p className="text-sm text-slate-500">
                {searchHistory.length} recent {searchHistory.length === 1 ? 'search' : 'searches'}
              </p>
            </div>
            {searchHistory.length > 0 && (
              <button onClick={handleClearHistory} className="btn btn-secondary text-sm">
                Clear History
              </button>
            )}
          </div>

          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-600"
                >
                  <span className="text-slate-400">•</span>
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">No search history yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

