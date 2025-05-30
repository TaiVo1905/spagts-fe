import { Class } from '../interface/Interface';
import axiosClient from './axiosClient';

export interface ClassResponse {
  data: Class[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const classService = {
  getClasses: async (page: number = 1, perPage: number = 10): Promise<ClassResponse> => {
    try {
      const response = await axiosClient.get(`/classes`, {
        params: {
          page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  getUserClasses: async (userId: number): Promise<ClassResponse> => {
    try {
      const response = await axiosClient.get(`/users/${userId}/classes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      
      await axiosClient.delete(`/classes/${id}/users`);
      await axiosClient.delete(`/classes/${id}/modules`);
      
      await axiosClient.delete(`/classes/${id}`);
    } catch (error: any) {
      console.error('Error deleting class:', error);
      throw new Error(error.response?.data?.message || 'Error deleting class');
    }
  },
};