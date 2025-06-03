import toast from 'react-hot-toast';
import { User } from '../interface/Interface';
import axiosClient from './axiosClient';

import React from 'react';


export interface AddUserPayload {
  id?: number,
  name: string;
  email: string;
  roles: string;
  password?: string;
  password_confirmation?: string;
}

export interface UserResponse {
  data: {
    id: number;
    name: string;
    email: string;
    roles: string;
    created_at: string;
  }[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const userService = {
  getUsers: (page: number = 1, perPage: number = 10): Promise<UserResponse> => axiosClient.get('/users', {
    params: {
      page,
      per_page: perPage
    }}),

  getStudent: async(studentId: number) => {
    const response = await axiosClient.get(`/users/${studentId}`);
    return response.data;
    
  },

  addUser: (data: AddUserPayload) => axiosClient.post('/users', data),

  importUsers: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/users/import', formData);
  },

  downloadTemplate: () => axiosClient.get('/users/import/template', { 
    responseType: 'blob',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }),

  uploadAvatar: async (userId: number, file: File) => {
        const formData = new FormData();
        formData.append('image_url', file);
        formData.append('_method', 'PATCH');
        try {
            const response = await axiosClient.post(`/users/${userId}`, formData
            );
            console.log('Upload response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

  updateProfile: async (userId: number, data: { name?: string; email?: string }) => {
      try {
          const response = await axiosClient.patch(`/users/${userId}`, data);
          return response.data;
      } catch (error) {
          console.error('Update profile error:', error);
          throw error;
      }
  },

  updatePassword: async (userId: number, data: { 
      current_password: string;
      password: string;
      password_confirmation: string;
  }) => {
      try {
          const response = await axiosClient.patch(`/users/${userId}`, data);
          return response.data;
      } catch (error) {
          console.error('Update password error:', error);
          throw error;
      }
  },
  updateRole: async (userId: number, data: {
      roles: string;
  }) => {
      try {
          const response = await axiosClient.patch(`/users/${userId}`, data);
          return response.data;
      } catch (error) {
          console.error('Update role error:', error);
          throw error;
      }
  },
    deleteUser: async (id: number, setUsers: React.Dispatch<React.SetStateAction<any[]>>) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/users/${id}`);
      setUsers((prev: any[]) => prev.filter((user) => user.id !== id));
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  }
};

export default userService; 