import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'manager'] },
  { name: 'Supplier Dashboard', href: '/supplier', icon: TruckIcon, roles: ['supplier'] },
  { name: 'Products', href: '/products', icon: CubeIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['admin', 'manager'] },
  { name: 'Admin', href: '/admin', icon: UserGroupIcon, roles: ['admin'] },
  { name: 'Profile', href: '/profile', icon: UserIcon, roles: ['admin', 'manager', 'supplier'] },
];

import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'manager'] },
  { name: 'Supplier Dashboard', href: '/supplier', icon: TruckIcon, roles: ['supplier'] },
  { name: 'Products', href: '/products', icon: CubeIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['admin', 'manager'] },
  { name: 'Admin', href: '/admin', icon: UserGroupIcon, roles: ['admin'] },
  { name: 'Profile', href: '/profile', icon: UserIcon, roles: ['admin', 'manager', 'supplier'] },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar = ({ isOpen = true, onClose, isMobile = false }: SidebarProps) => {
  const location = useLocation();
  const { hasRole } = useAuthStore();

  const filteredNav = navigation.filter((item) => hasRole(item.roles));

  const sidebarContent = (
    <div className={`flex flex-col h-full border-r-2 border-primary-100 bg-white/95 backdrop-blur-sm shadow-xl ${
      isMobile ? 'w-72' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-6 border-b-2 border-primary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Smart Grocery
            </h2>
            <p className="text-xs text-slate-500">Refill System</p>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="rounded-xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Inventory health</p>
          <p className="mt-1 text-3xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">92%</p>
          <p className="text-xs text-slate-500">Auto-refill active</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2" role="navigation">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <aside
        className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {sidebarContent}
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block flex-shrink-0" aria-label="Primary navigation">
      <div className={`h-full transition-all duration-300 ${isOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        {sidebarContent}
      </div>
    </aside>
  );
};

