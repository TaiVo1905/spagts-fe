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

  createClass: async (data: { teacher_id: number; name: string }): Promise<Class> => {
    try {
      const response = await axiosClient.post('/classes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  updateClass: async (data: { class_id: number, teacher_id: number; name: string }) => {
    try {
      const response = await axiosClient.put(`/classes/${data.class_id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  deleteClass: async (id: number): Promise<void> => {
    try {
      await axiosClient.delete(`/classes/${id}`);
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }
};