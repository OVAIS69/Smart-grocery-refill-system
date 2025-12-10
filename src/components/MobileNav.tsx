import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  BellIcon,
  UserIcon,
  TruckIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const mobileNav = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'manager'] },
  { name: 'Supplier', href: '/supplier', icon: TruckIcon, roles: ['supplier'] },
  { name: 'Products', href: '/products', icon: CubeIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, roles: ['admin', 'manager', 'supplier'] },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['admin', 'manager', 'supplier'] },
];

export const MobileNav = () => {
  const location = useLocation();
  const { hasRole } = useAuthStore();

  const filteredNav = mobileNav.filter((item) => hasRole(item.roles));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-primary-100 shadow-2xl z-30 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                isActive
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:bg-primary-50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {item.name.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

