import { create } from 'zustand';
import { api } from '../lib/api';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ user: userData, token, isAuthenticated: true });
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

// Listen to custom events from axios interceptor
window.addEventListener('token-refreshed', ((e: CustomEvent) => {
  const token = e.detail;
  localStorage.setItem('token', token);
  useAuthStore.setState({ token });
}) as EventListener);

window.addEventListener('logout-trigger', () => {
  useAuthStore.getState().logout();
});

// Initialize Authorization header if token exists on load
const existingToken = localStorage.getItem('token');
if (existingToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}
