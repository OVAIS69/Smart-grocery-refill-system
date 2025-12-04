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
        <div className="flex w-64 flex-col rounded-3xl border border-primary-500/20 bg-dark-800/60 p-5 shadow-glow-green-sm backdrop-blur-xl">
          <div className="mb-6 rounded-2xl border border-primary-500/30 bg-primary-500/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-400">Inventory health</p>
            <p className="mt-1 text-3xl font-semibold glow-text">92%</p>
            <p className="text-xs text-primary-300/60">Auto-refill active</p>
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
                      ? 'bg-primary-600 text-white shadow-glow-green-sm border border-primary-500/50'
                      : 'text-primary-300/70 hover:bg-primary-500/20 hover:text-primary-400 hover:border hover:border-primary-500/30'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-white' : 'text-primary-400/60 group-hover:text-primary-400'
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

