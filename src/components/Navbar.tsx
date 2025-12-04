import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from './Badge';


interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  if (!user) return null;

  return (
    <nav className="relative border-b-2 border-primary-100 bg-white/80 backdrop-blur-xl shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-lg font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              SG
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">Smart Grocery</p>
              <p className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Refill HQ</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
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

