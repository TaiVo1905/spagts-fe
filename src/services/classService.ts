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

export interface ClassMemberUpdateRequest {
  student_ids: number[];
  teacher_ids: number[];
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

  add: async (data: { teacher_id: number; name: string }): Promise<{ data: Class }> => {
    try {
      const response = await axiosClient.post('/classes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  update: async (data: { class_id: number; teacher_id: number; name: string }): Promise<{ data: Class }> => {
    try {
      // First get current class data
      const currentClass = await axiosClient.get(`/classes/${data.class_id}`);
      const currentData = currentClass.data.data;

      // Update class info
      const response = await axiosClient.put(`/classes/${data.class_id}`, {
        teacher_id: data.teacher_id,
        name: data.name
      });

      // If update fails, throw error
      if (!response.data) {
        throw new Error('Failed to update class');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      // Delete in reverse order to maintain referential integrity
      await axiosClient.delete(`/classes/${id}/users`);
      await axiosClient.delete(`/classes/${id}/modules`);
      await axiosClient.delete(`/classes/${id}`);
    } catch (error: any) {
      console.error('Error deleting class:', error);
      throw new Error(error.response?.data?.message || 'Error deleting class');
    }
  },

  getClassMembers: async (classId: number) => {
    try {
      const response = await axiosClient.get(`/classes/${classId}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class members:', error);
      throw error;
    }
  },

  updateClassMembers: async (classId: number, data: ClassMemberUpdateRequest) => {
    try {
      // Get current members first
      const currentMembers = await this.getClassMembers(classId);
      
      // Update members
      const response = await axiosClient.put(`/classes/${classId}/users`, data);
      
      // If update fails, throw error
      if (!response.data) {
        throw new Error('Failed to update class members');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating class members:', error);
      throw error;
    }
  },

  deleteClassUsers: async (classId: number) => {
    try {
      const response = await axiosClient.delete(`/classes/${classId}/users`);
      return response.data;
    } catch (error) {
      console.error('Error deleting class users:', error);
      throw error;
    }
  },

  deleteClassModules: async (classId: number) => {
    try {
      const response = await axiosClient.delete(`/classes/${classId}/modules`);
      return response.data;
    } catch (error) {
      console.error('Error deleting class modules:', error);
      throw error;
    }
  }
};