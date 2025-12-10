import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BellIcon, UserCircleIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from './Badge';

interface NavbarProps {
  onMenuClick?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', roles: ['admin', 'manager', 'supplier'] },
  { name: 'Messages', href: '/messages', roles: ['admin', 'manager', 'supplier'] },
  { name: 'Products', href: '/products', roles: ['admin', 'manager', 'supplier'] },
  { name: 'Orders', href: '/orders', roles: ['admin', 'manager', 'supplier'] },
  { name: 'Notifications', href: '/notifications', roles: ['admin', 'manager', 'supplier'] },
  { name: 'Settings', href: '/settings', roles: ['admin', 'manager', 'supplier'] },
  { name: 'Reports', href: '/reports', roles: ['admin', 'manager'] },
  { name: 'About', href: '/about', roles: ['admin', 'manager', 'supplier'] },
];

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navigation.filter((item) => hasRole(item.roles));

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-primary-100 bg-white/80 backdrop-blur-xl shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Branding */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-lg font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              SG
            </div>
            <div className="hidden sm:block">
              <p className="text-sm uppercase tracking-widest text-slate-500">Smart Grocery</p>
              <p className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Refill HQ</p>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-8" aria-label="Primary navigation">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href || (item.href === '/' && location.pathname === '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="relative rounded-full p-2 text-slate-600 transition hover:bg-primary-50 hover:text-primary-600"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            onClick={() => navigate('/notifications')}
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white shadow-lg">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="hidden rounded-full p-2 text-slate-600 transition hover:bg-primary-50 hover:text-primary-600 sm:inline-flex"
            aria-label="Profile"
          >
            <UserCircleIcon className="h-7 w-7" />
          </button>
          <div className="hidden flex-col text-right text-xs text-slate-600 sm:flex">
            <span className="font-semibold text-slate-900">{user.name}</span>
            <Badge variant="info" className="bg-primary-100 text-primary-700 border-primary-200">
              {user.role}
            </Badge>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary-200 bg-primary-50 text-primary-700 text-sm font-medium transition hover:bg-primary-100 hover:border-primary-300"
            aria-label="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
          <button
            className="inline-flex rounded-full p-2 text-slate-600 transition hover:bg-primary-50 lg:hidden"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              onMenuClick?.();
            }}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

