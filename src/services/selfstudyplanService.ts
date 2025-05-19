import axiosClient from './axiosClient';

export interface SelfStudyPlan {
  id?: number;
  module_id: number;
  date: string;
  lesson_learned: string;
  time_allocation: number;
  learning_resources: string;
  learning_activities: string;
  concentration: number;
  follow_plan_reflection: string;
  evaluation: string;
  reinforcing_techniques: string;
  note: string;
  student_id:number;
  semester:number;
  
}

const selfStudyPlanService = {
  getSelfStudyPlans: async (student_id: number, semester: number) => {
    const response = await axiosClient.get(`users/${student_id}/self-study-plans?semester=${semester}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosClient.get(`/self-study-plans/${id}`);
    return response.data;
  },

async addSelfStudyPlan(student_id: number, data: SelfStudyPlan,) {
    const response = await axiosClient.post(`users/${student_id}/self-study-plans`, data);
    return response.data;
  },

  updateSelfStudyPlan: async (id: number, data: SelfStudyPlan) => {
    const response = await axiosClient.patch(`/self-study-plans/${id}`, data);
    return response.data;
  },

  deleteSelfStudyPlan: async (id: number): Promise<void> => {
    await axiosClient.delete(`/self-study-plans/${id}`);
  },
};

export default selfStudyPlanService;