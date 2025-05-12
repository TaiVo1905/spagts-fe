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
  getClasses: async (page: number = 1, perPage: number = 12): Promise<ClassResponse> => {
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
};