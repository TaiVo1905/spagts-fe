import axiosClient from './axiosClient';
import { User } from '../interface/Interface';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axiosClient.post('/login', { email, password });
    const { token, user } = response.data;
    if (!user || !token) {
      throw new Error('Invalid response from server');
    }
    localStorage.setItem('token', token);
    return { token, user };
  },

  async logout(): Promise<void> {
    try {
      await axiosClient.post('/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosClient.get('/user');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};