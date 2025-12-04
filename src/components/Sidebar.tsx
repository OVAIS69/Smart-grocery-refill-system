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
        <div className="flex w-64 flex-col rounded-3xl border-2 border-primary-100 bg-white/80 backdrop-blur-sm p-5 shadow-lg">
          <div className="mb-6 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Inventory health</p>
            <p className="mt-1 text-3xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">92%</p>
            <p className="text-xs text-slate-500">Auto-refill active</p>
          </div>
          <nav className="flex-1 space-y-1" role="navigation">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
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
      </div>
    </aside>
  );
};

