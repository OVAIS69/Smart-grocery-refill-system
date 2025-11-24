import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      initialize: () => {
        const user = authService.getStoredUser();
        const token = authService.getToken();
        set({
          user,
          token,
          isAuthenticated: !!user && !!token,
        });
      },

      login: async (email: string, password: string) => {
        const { token, user } = await authService.login({ email, password });
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      hasRole: (roles: string[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

