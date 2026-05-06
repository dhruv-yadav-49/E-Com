import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Catch 401 errors, avoid infinite loop on refresh-token endpoint
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/refresh-token') {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8080/api/auth/refresh-token', { token: refreshToken });
          const newAccessToken = res.data.data.accessToken;
          const newRefreshToken = res.data.data.refreshToken;
          
          localStorage.setItem('token', newAccessToken);
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
          
          // Replay the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshErr) {
          // If refresh token fails, log user out
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        }
      } else {
        // No refresh token available, force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
