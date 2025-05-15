import axiosClient from './axiosClient';

import { User } from '../interface/Interface';

import React from 'react';


export interface AddUserPayload {
  name: string;
  email: string;
  roles: string;
  password?: string;
  password_confirmation?: string;
}

const userService = {
  getUsers: () => axiosClient.get('/users'),

  addUser: (data: AddUserPayload) => axiosClient.post('/users', data),

  importUsers: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/users/import', formData);
  },

  downloadTemplate: () => axiosClient.get('/users/template', { 
    responseType: 'blob',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }),

  uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('imageUrl', file);
        try {
            const response = await axiosClient.post("/users/avatar", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.imageUrl;
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
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  }
};

export default userService; 