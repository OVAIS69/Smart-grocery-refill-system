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

export const Sidebar = () => {
  const location = useLocation();
  const { hasRole } = useAuthStore();

  const filteredNav = navigation.filter((item) => hasRole(item.roles));

  return (
    <aside className="hidden md:flex md:flex-shrink-0" aria-label="Primary navigation">
      <div className="sticky top-6 hidden md:flex">
        <div className="flex w-64 flex-col rounded-3xl border border-white/70 bg-white/90 p-5 shadow-card backdrop-blur-sm">
          <div className="mb-6 rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">Inventory health</p>
            <p className="mt-1 text-3xl font-semibold text-primary-700">92%</p>
            <p className="text-xs text-neutral-500">Auto-refill active</p>
          </div>
          <nav className="flex-1 space-y-1" role="navigation">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-neutral-400 group-hover:text-primary-600'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

