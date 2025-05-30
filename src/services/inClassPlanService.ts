// inClassPlanService.ts
import axiosClient from './axiosClient';

export interface InClassPlan {
  id: number;
  date: string;
  lesson_learned: string;
  self_assessment: number;
  difficulties: string;
  plan_to_improve: string;
  problem_solved: boolean;
  module_id: number;
  student_id: number;
  semester: number
}

const inClassPlanService = {
  getAll: async (student_id: number, semester: number) => {
    const response = await axiosClient.get(`/in-class-plan?studentId=${student_id}&semester=${semester}`);
    return response.data;
  },


  getById: async (id: number) => {
    const response = await axiosClient.get(`/in-class-plan/${id}`);
    return response.data;
  },


  add: async (student_id: number, data: InClassPlan) => {
    const response = await axiosClient.post(`/in-class-plan?studentId=${student_id}`, data);
    return response.data;
  },


  update: async (id: number, data: InClassPlan) => {
    const response = await axiosClient.patch(`/in-class-plan/${id}`, data);
    return response.data;
  },


  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/in-class-plan/${id}`);
  },
};

export default inClassPlanService;
