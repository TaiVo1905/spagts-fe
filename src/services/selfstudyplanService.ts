import axiosClient from './axiosClient';

export interface SelfstudyPlan {
  id: number;
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
  
}

const selfstudyPlanService = {
  getAll: async (): Promise<SelfstudyPlan[]> => {
    const response = await axiosClient.get('/self-study-plans');
    return response.data.data;
  },

  getById: async (id: number): Promise<SelfstudyPlan> => {
    const response = await axiosClient.get(`/self-study-plans/${id}`);
    return response.data;
  },

async create(plan: Omit<SelfstudyPlan, 'id'>): Promise<SelfstudyPlan> {
    const response = await axiosClient.post('/self-study-plans', plan);
    const createdPlan = response.data;
    if (!createdPlan.id) {
      console.error('Kế hoạch mới:', createdPlan);
    }
    return createdPlan;
  },

  update: async (id: number, data: Partial<SelfstudyPlan>): Promise<SelfstudyPlan> => {
    const response = await axiosClient.put(`/self-study-plans/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/self-study-plans/${id}`);
  },
};

export default selfstudyPlanService;