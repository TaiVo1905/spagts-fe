// inclassPlanService.ts
import axiosClient from './axiosClient';

export interface InclassPlan {
  id: number;
  date: string;
  lesson_learned: string;
  self_assessment: number;
  difficulties: string;
  plan_to_improve: string;
  problem_solved: boolean;

}

const inclassPlanService = {
  // Lấy toàn bộ danh sách kế hoạch
  getAll: async (): Promise<InclassPlan[]> => {
    const response = await axiosClient.get('/inclass-plan');
    return response.data.data;
  },

  // Lấy kế hoạch theo ID
  getById: async (id: number): Promise<InclassPlan> => {
    const response = await axiosClient.get(`/inclass-plan/${id}`);
    return response.data;
  },

  // Tạo mới kế hoạch
  create: async (data: Omit<InclassPlan, 'id'>): Promise<InclassPlan> => {
    const response = await axiosClient.post('/inclass-plan', data);
    return response.data;
  },

  // Cập nhật kế hoạch theo ID
  update: async (id: number, data: Partial<InclassPlan>): Promise<InclassPlan> => {
    const response = await axiosClient.put(`/inclass-plan/${id}`, data);
    return response.data;
  },

  // Xoá kế hoạch theo ID
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/inclass-plan/${id}`);
  },
};

export default inclassPlanService;
