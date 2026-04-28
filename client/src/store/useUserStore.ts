import { create } from 'zustand';
import { api } from '../lib/api';

interface UserState {
  stats: any | null;
  badges: any[];
  streak: any | null;
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchStreak: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  stats: null,
  badges: [],
  streak: null,
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/user/stats');
      set({ stats: data.data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBadges: async () => {
    try {
      const { data } = await api.get('/user/badges');
      set({ badges: data.data });
    } catch (e) {}
  },

  fetchStreak: async () => {
    try {
      const { data } = await api.get('/user/streak');
      set({ streak: data.data });
    } catch (e) {}
  }
}));
