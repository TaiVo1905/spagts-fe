import axiosClient from './axiosClient';

export interface ClassMemberUpdateRequest {
  student_ids: number[];
  teacher_ids: number[];
}

export const classUserService = {
  addUsersToClass: async (classId: number, data: ClassMemberUpdateRequest) => {
    try {
      const response = await axiosClient.put(`/classes/${classId}/users`, data);
      return response.data;
    } catch (error) {
      console.error('Error adding users to class:', error);
      throw error;
    }
  },

  getClassUsers: async (classId: number) => {
    try {
      const response = await axiosClient.get(`/classes/${classId}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class users:', error);
      throw error;
    }
  },

  removeUserFromClass: async (classId: number, userId: number) => {
    try {
      const response = await axiosClient.delete(`/classes/${classId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing user from class:', error);
      throw error;
    }
  }
};