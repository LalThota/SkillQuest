import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh-token');
        // Token logic isn't stored in headers directly if using httpOnly refresh,
        // Assuming access token is passed in Bearer:
        const accessToken = data.data.accessToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Use Zustand auth store to update the token?
        // Actually, we should dispatch an event or call store.
        window.dispatchEvent(new CustomEvent('token-refreshed', { detail: accessToken }));
        
        return api(originalRequest);
      } catch (err) {
        // Logout on failure
        window.dispatchEvent(new Event('logout-trigger'));
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
