import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authService.login({ email, password });
          set({
            user: response,
            token: response.token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error en login:', error);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await authService.register({ name, email, password });
          set({
            user: response,
            token: response.token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error en register:', error);
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);