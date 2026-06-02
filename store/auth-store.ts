'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types';
import { demoUser } from '@/data/seed';
import { uid } from '@/lib/id';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email) => set({ user: { ...demoUser, email }, isAuthenticated: true }),
      register: (name, email) => set({ user: { id: uid('user'), name, email, role: 'OWNER' }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : state.user }))
    }),
    { name: 'mb-auth-v1' }
  )
);
