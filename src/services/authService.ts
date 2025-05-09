import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: 'Admin' | 'Teacher' | 'Student';
}

interface LoginResponse {
  token: string;
  user: User;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axiosInstance.post('/login', { email, password });
    const { token, user } = response.data;
    
    if (!user || !token) {
      throw new Error('Invalid response from server');
    }
    
    localStorage.setItem('token', token);
    return { token, user };
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get('/user');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};